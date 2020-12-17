import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../../model/portcall-timestamp";
import {PortcallTimestampService} from "../../controller/services/portcall-timestamp.service";
import {MessageService, SelectItem} from "primeng/api";
import {PortcallTimestampType} from "../../model/portcall-timestamp-type.enum";
import {BehaviorSubject, forkJoin, Observable} from "rxjs";
import {PortIdToPortPipe} from "../../controller/pipes/port-id-to-port.pipe";
import {PortCallTimestampTypeToStringPipe} from "../../controller/pipes/port-call-timestamp-type-to-string.pipe";
import {Port} from "../../model/port";
import {TerminalIdToTerminalPipe} from "../../controller/pipes/terminal-id-to-terminal.pipe";
import {Terminal} from "../../model/terminal";
import {DialogService} from "primeng/dynamicdialog";
import {TimestampCommentDialogComponent} from "../timestamp-comment-dialog/timestamp-comment-dialog.component";
import {DelayCode} from "../../model/delayCode";
import {DateToUtcPipe} from "../../controller/pipes/date-to-utc.pipe";
import {PortService} from "../../controller/services/port.service";
import {TerminalService} from "../../controller/services/terminal.service";
import {DelayCodeService} from "../../controller/services/delay-code.service";
import {take} from "rxjs/operators";
import {VesselService} from "../../controller/services/vessel.service";
import {Vessel} from "../../model/vessel";
import {VesselIdToVesselPipe} from "../../controller/pipes/vesselid-to-vessel.pipe";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-timestamp-editor',
  templateUrl: './timestamp-editor.component.html',
  styleUrls: ['./timestamp-editor.component.scss'],
  providers: [
    PortIdToPortPipe,
    PortCallTimestampTypeToStringPipe,
    TerminalIdToTerminalPipe,
    DialogService,
    VesselIdToVesselPipe
  ]
})
export class TimestampEditorComponent implements OnInit, OnChanges {
  @Input('vesselId') vesselId: number;
  @Input('portOfCall') portOfCall: Port;

  @Output('timeStampAddedNotifier') timeStampAddedNotifier: EventEmitter<PortcallTimestamp> = new EventEmitter<PortcallTimestamp>()

  $timestamps: BehaviorSubject<PortcallTimestamp[]>;

  delayCodes: DelayCode[] = [];
  ports: Port[] = [];
  terminals: Terminal[] = [];
  vessels: Vessel[] = [];

  portOptions: SelectItem[] = [];
  terminalOptions: SelectItem[] = [];
  timestampTypes: SelectItem[] = [];
  directions: SelectItem[] = [];
  vesselOptions: SelectItem[] = [];

  defaultTimestamp: PortcallTimestamp = {
    id: null,
    timestampType: null,
    callSequence: null,
    logOfTimestamp: null,
    eventTimestamp: null,
    direction: null,
    locationId: '',
    portPrevious: null,
    portOfCall: null,
    portNext: null,
    terminal: null,
    classifierCode: '',
    eventTypeCode: '',
    vessel: null,
    modifiable: true,
    messagingStatus: null,
    messagingDetails: null,
  };

  constructor(private portcallTimestampService: PortcallTimestampService,
              private messageService: MessageService,
              private portIdToPortPipe: PortIdToPortPipe,
              private delayCodeService: DelayCodeService,
              private vesselService: VesselService,
              private portService: PortService,
              private terminalService: TerminalService,
              private portCallTimestampTypePipe: PortCallTimestampTypeToStringPipe,
              private terminalIdToTerminalPipe: TerminalIdToTerminalPipe,
              private vesselIdToVesselPipe: VesselIdToVesselPipe,
              private dialogService: DialogService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.delayCodeService.getDelayCodes().pipe(take(1)).subscribe(delayCodes => this.delayCodes = delayCodes);

    this.$timestamps = new BehaviorSubject([this.defaultTimestamp]);

    this.updateDirectionOptions();

    this.updateTimestampTypeOptions();

    this.updatePortOptions();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateVesselOptions();
      this.updateTerminalOptions(this.portOfCall.id);
      this.updateTimestampTypeOptions();
      this.updateDirectionOptions();
      this.updatePortOptions();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const $terminals: Observable<Terminal[]> = this.terminalService.getTerminals().pipe(take(1));
    const $vessels: Observable<Vessel[]> = this.vesselService.getVessels().pipe(take(1));

    forkJoin({$terminals, $vessels}).subscribe(results => {
      this.vessels = results.$vessels;
      this.terminals = results.$terminals

      this.updateVesselOptions();

      this.updatePortCallTimeStampToBeEdited()
    })
  }

  savePortcallTimestamp(portcallTimestamp: PortcallTimestamp, vesselId: number) {
    const dateToUtc = new DateToUtcPipe();
    portcallTimestamp.eventTimestamp = dateToUtc.transform(portcallTimestamp.eventTimestamp)
    portcallTimestamp.logOfTimestamp = dateToUtc.transform(portcallTimestamp.logOfTimestamp)

    const vesselIdToBeSend: number = (portcallTimestamp.vessel as Vessel).id
    this.portcallTimestampService.addPortcallTimestamp(portcallTimestamp, vesselIdToBeSend).subscribe((portcallTimestampAdded: PortcallTimestamp) => {
      this.messageService.add({
        key: 'TimestampAddSuccess',
        severity: 'success',
        summary: 'Successfully added new port call timestamp to vessel',
        detail: ''
      });
      this.timeStampAddedNotifier.emit(portcallTimestampAdded);
      this.updatePortCallTimeStampToBeEdited();
    }, response => this.messageService.add({
      key: 'TimestampAddError',
      severity: 'error',
      summary: 'Error while adding port call timestamp',
      detail: response.error.message
    }));
  }

  updateTerminalOptions(portOfCallId: number) {
    this.terminalOptions = [];
    this.terminalOptions.push({label: this.translate.instant('general.terminal.select'), value: null});
    this.terminals.forEach(terminal => {
      if (terminal.port === portOfCallId) {
        this.terminalOptions.push({label: terminal.smdgCode, value: terminal});
      }
    })
  }

  updateVesselOptions() {
    this.vesselOptions = [];
    this.vesselOptions.push({label: this.translate.instant('general.vessel.select'), value: null});
    this.vessels.forEach(vessel => {
      this.vesselOptions.push({label: vessel.name + ' (' + vessel.imo + ')', value: vessel});
    });
  }

  updateTimestampTypeOptions() {
    this.timestampTypes = [];
    this.timestampTypes.push({label: this.translate.instant('general.timestamp.select'), value: null});
    for (let item in PortcallTimestampType) {
      this.timestampTypes.push({label: PortcallTimestampType[item], value: item})
    }
  }

  updateDirectionOptions() {
    this.directions = [];
    this.directions.push({label: this.translate.instant('general.direction.select'), value: null});
    this.directions.push({label: 'N', value: 'N'});
    this.directions.push({label: 'E', value: 'E'});
    this.directions.push({label: 'S', value: 'S'});
    this.directions.push({label: 'W', value: 'W'});
  }

  updatePortOptions() {
    this.portService.getPorts().subscribe(ports => {
      this.ports = ports;
      this.portOptions = [];
      this.portOptions.push({label: this.translate.instant('general.port.select'), value: null});
      ports.forEach(port => {
        this.portOptions.push({label: port.unLocode, value: port});
      });
    });
  }

  validatePortOfCallTimestamp(timestamp: PortcallTimestamp): boolean {
    return !(timestamp.timestampType &&
      timestamp.logOfTimestamp &&
      timestamp.eventTimestamp &&
      timestamp.direction &&
      timestamp.portNext &&
      timestamp.portPrevious &&
      timestamp.portOfCall &&
      timestamp.terminal);
  }

  private updatePortCallTimeStampToBeEdited() {
    this.portcallTimestampService.getPortcallTimestamps().pipe(take(1)).subscribe(portCallTimeStamps => {
      const lastTimeStampIndex = portCallTimeStamps.length - 1;
      const newPortcallTimestamp: PortcallTimestamp = portCallTimeStamps[lastTimeStampIndex];
      if (newPortcallTimestamp) {
        newPortcallTimestamp.id = null;
        newPortcallTimestamp.portOfCall = this.portIdToPortPipe.transform(newPortcallTimestamp.portOfCall as number, this.ports);
        newPortcallTimestamp.portPrevious = this.portIdToPortPipe.transform(newPortcallTimestamp.portPrevious as number, this.ports);
        newPortcallTimestamp.portNext = this.portIdToPortPipe.transform(newPortcallTimestamp.portNext as number, this.ports);
        newPortcallTimestamp.terminal = this.terminalIdToTerminalPipe.transform(newPortcallTimestamp.terminal as number, this.terminals);
        newPortcallTimestamp.vessel = this.vesselIdToVesselPipe.transform(newPortcallTimestamp.vessel as number, this.vessels);

        //ToDo switch time zone to local time zone, quick fix to show last time at port of call
        newPortcallTimestamp.logOfTimestamp = null;
        newPortcallTimestamp.eventTimestamp = null
        newPortcallTimestamp.changeComment = ""

        this.portOfCall ? this.updateTerminalOptions(this.portOfCall.id) : this.updateTerminalOptions(newPortcallTimestamp.portOfCall.id);

        this.$timestamps.next([newPortcallTimestamp]);
      } else {
        // if there is no entry
        this.$timestamps.next([this.defaultTimestamp]);
      }
    });
  }

  addComment(timestamp: PortcallTimestamp) {
    this.dialogService.open(TimestampCommentDialogComponent, {
      header: this.translate.instant('general.comment.header'),
      width: '50%', data: {timestamp: timestamp, delayCode: this.delayCodes, editMode: false}
    });
  }
}
