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
  @Input('vesselSavedId') vesselSavedId: number;
  @Input('portOfCall') portOfCall: Port;

  @Output('timeStampAddedNotifier') timeStampAddedNotifier: EventEmitter<PortcallTimestamp> = new EventEmitter<PortcallTimestamp>()

  $timestamps: BehaviorSubject<PortcallTimestamp[]>;
  logOfTimestampDate: Date;
  logOfTimestampTime: String;
  eventTimestampDate: Date;
  eventTimestampTime: String;

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
      this.updateTerminalOptions(this.portOfCall ? this.portOfCall.id : -1);
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

  savePortcallTimestamp(portcallTimestamp: PortcallTimestamp) {
    const dateToUtc = new DateToUtcPipe();

    portcallTimestamp.logOfTimestamp = this.logOfTimestampDate;
    let logOfTimestampTimeStrings = this.logOfTimestampTime.split(":");
    portcallTimestamp.logOfTimestamp.setHours(parseInt(logOfTimestampTimeStrings[0]), parseInt(logOfTimestampTimeStrings[1]));
    console.debug("LogOfTimestamp before conversion: " + portcallTimestamp.logOfTimestamp);

    portcallTimestamp.eventTimestamp = this.eventTimestampDate;
    let eventTimestampTimeStrings = this.eventTimestampTime.split(":");
    portcallTimestamp.eventTimestamp.setHours(parseInt(eventTimestampTimeStrings[0]), parseInt(eventTimestampTimeStrings[1]));
    console.debug("EventTimestamp before conversion: " + portcallTimestamp.eventTimestamp);

    portcallTimestamp.logOfTimestamp = dateToUtc.transform(portcallTimestamp.logOfTimestamp)
    console.debug("LogOfTimestamp: " + portcallTimestamp.logOfTimestamp);
    portcallTimestamp.eventTimestamp = dateToUtc.transform(portcallTimestamp.eventTimestamp)
    console.debug("EventTimestamp: " + portcallTimestamp.eventTimestamp);

    this.portcallTimestampService.addPortcallTimestamp(portcallTimestamp).subscribe((portcallTimestampAdded: PortcallTimestamp) => {
      this.messageService.add({
        key: 'TimestampAddSuccess',
        severity: 'success',
        summary: this.translate.instant('general.save.editor.success'),
        detail: ''
      });
      this.timeStampAddedNotifier.emit(portcallTimestampAdded);
      this.updatePortCallTimeStampToBeEdited();
    }, response => this.messageService.add({
      key: 'TimestampAddError',
      severity: 'error',
      summary: this.translate.instant('general.save.editor.failure'),
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
      this.logOfTimestampDate && this.logOfTimestampTime &&
      this.eventTimestampDate && this.eventTimestampTime &&
      timestamp.direction &&
      timestamp.portNext &&
      timestamp.portPrevious &&
      timestamp.portOfCall &&
      timestamp.terminal);
  }

  private updatePortCallTimeStampToBeEdited() {
    this.portcallTimestampService.getHighesTimestamp(this.vesselId).pipe(take(1)).subscribe(portCallTimeStamp => {
      if (portCallTimeStamp) {
        portCallTimeStamp.id = null;
        portCallTimeStamp.portOfCall = this.portIdToPortPipe.transform(portCallTimeStamp.portOfCall as number, this.ports);
        portCallTimeStamp.portPrevious = this.portIdToPortPipe.transform(portCallTimeStamp.portPrevious as number, this.ports);
        portCallTimeStamp.portNext = this.portIdToPortPipe.transform(portCallTimeStamp.portNext as number, this.ports);
        portCallTimeStamp.terminal = this.terminalIdToTerminalPipe.transform(portCallTimeStamp.terminal as number, this.terminals);
        if (this.vesselId) {
          portCallTimeStamp.vessel = this.vesselIdToVesselPipe.transform(this.vesselId, this.vessels);
        } else {
          portCallTimeStamp.vessel = this.vesselIdToVesselPipe.transform(portCallTimeStamp.vessel as number, this.vessels);
        }

        //ToDo switch time zone to local time zone, quick fix to show last time at port of call
        portCallTimeStamp.logOfTimestamp = null;
        portCallTimeStamp.eventTimestamp = null
        portCallTimeStamp.changeComment = ""

        this.portOfCall ? this.updateTerminalOptions(this.portOfCall.id) : this.updateTerminalOptions(portCallTimeStamp.portOfCall.id);

        this.$timestamps.next([portCallTimeStamp]);
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

  setLogOfTimestampToNow() {
    this.logOfTimestampDate = new Date();
    this.logOfTimestampTime = this.leftPadWithZero(this.logOfTimestampDate.getHours()) + ":" + this.leftPadWithZero(this.logOfTimestampDate.getMinutes());
  }


  setEventTimestampToNow() {
    this.eventTimestampDate = new Date();
    this.eventTimestampTime = this.leftPadWithZero(this.eventTimestampDate.getHours()) + ":" + this.leftPadWithZero(this.eventTimestampDate.getMinutes());
  }

  leftPadWithZero(item: number): String {
    return (String('0').repeat(2) + item).substr((2 * -1), 2);
  }
}
