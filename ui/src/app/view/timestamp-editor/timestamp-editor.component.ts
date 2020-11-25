import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../../model/portcall-timestamp";
import {PortcallTimestampService} from "../../controller/services/portcall-timestamp.service";
import {MessageService, SelectItem} from "primeng/api";
import {PortcallTimestampType} from "../../model/portcall-timestamp-type.enum";
import {BehaviorSubject} from "rxjs";
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


@Component({
  selector: 'app-timestamp-editor',
  templateUrl: './timestamp-editor.component.html',
  styleUrls: ['./timestamp-editor.component.scss'],
  providers: [PortIdToPortPipe, PortCallTimestampTypeToStringPipe, TerminalIdToTerminalPipe, DialogService]
})
export class TimestampEditorComponent implements OnInit, OnChanges {
  @Input('vesselId') vesselId: number;
  @Input('portOfCall') portOfCall: Port;

  @Output('timeStampAddedNotifier') timeStampAddedNotifier: EventEmitter<PortcallTimestamp> = new EventEmitter<PortcallTimestamp>()

  $timestamps: BehaviorSubject<PortcallTimestamp[]>;

  delayCodes: DelayCode[] = [];
  ports: Port[] = [];
  terminals: Terminal[] = [];

  portOptions: SelectItem[] = [];
  terminalOptions: SelectItem[] = [];
  timestampTypes: SelectItem[] = [];
  directions: SelectItem[] = [];

  en: any;

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
    vessel: null
  };

  constructor(private portcallTimestampService: PortcallTimestampService,
              private messageService: MessageService,
              private portIdToPortPipe: PortIdToPortPipe,
              private delayCodeService: DelayCodeService,
              private portService: PortService,
              private terminalService: TerminalService,
              private portCallTimestampTypePipe: PortCallTimestampTypeToStringPipe,
              private terminalIdToTerminalPipe: TerminalIdToTerminalPipe,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.portOptions.push({label: 'Select port', value: null})
    this.portService.getPorts().pipe(take(1)).subscribe(ports => {
      this.ports = ports
      this.ports.forEach(port => this.portOptions.push({label: port.unLocode, value: port}));
    });
    this.terminalService.getTerminals().pipe(take(1)).subscribe(terminals => this.terminals = terminals);
    this.delayCodeService.getDelayCodes().pipe(take(1)).subscribe(delayCodes => this.delayCodes = delayCodes);

    this.$timestamps = new BehaviorSubject([this.defaultTimestamp]);



    this.directions = [
      {label: 'Select direction', value: null},
      {label: 'N', value: 'N'},
      {label: 'E', value: 'E'},
      {label: 'S', value: 'S'},
      {label: 'W', value: 'W'}
    ]

    this.timestampTypes = [{label: 'Select timestamp', value: null}];
    for (let item in PortcallTimestampType) {
      this.timestampTypes.push({label: PortcallTimestampType[item], value: item})
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePortCallTimeStampToBeEdited();
    // Workaround to change Calendr button "today" to "now"

    this.en = {
      firstDayOfWeek: 0,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      today: 'Now',
      clear: 'Clear'
    };

  }

  savePortcallTimestamp(portcallTimestamp: PortcallTimestamp, vesselId: number) {
    const dateToUtc = new DateToUtcPipe();
    console.log(portcallTimestamp.eventTimestamp)
    portcallTimestamp.eventTimestamp = dateToUtc.transform(portcallTimestamp.eventTimestamp)
    portcallTimestamp.logOfTimestamp = dateToUtc.transform(portcallTimestamp.logOfTimestamp)
    console.log(portcallTimestamp.eventTimestamp)

    this.portcallTimestampService.addPortcallTimestamp(portcallTimestamp, vesselId).subscribe((portcallTimestampAdded: PortcallTimestamp) => {
      this.messageService.add({
        key: 'TimestampAddSuccess',
        severity: 'success',
        summary: 'Successfully added new port call timestamp to vessel',
        detail: ''
      });
      this.timeStampAddedNotifier.emit(portcallTimestampAdded);
      this.updatePortCallTimeStampToBeEdited();
    }, error => this.messageService.add({
      key: 'TimestampAddError',
      severity: 'error',
      summary: 'Error while adding port call timestamp',
      detail: error.message
    }));
  }

  updateTerminalOptions(portOfCallId: number) {
    this.terminalOptions = [{label: 'Select terminal', value: null}];
    this.terminals.forEach(terminal => {
      if (terminal.port === portOfCallId) {
        this.terminalOptions.push({label: terminal.smdgCode, value: terminal});
      }
    })
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
    if (this.vesselId && this.vesselId > 0) {
      this.portcallTimestampService.getPortcallTimestampsForVesselId(this.vesselId).subscribe(portCallTimeStamps => {
        const lastTimeStampIndex = portCallTimeStamps.length - 1;
        const newPortcallTimestamp: PortcallTimestamp = portCallTimeStamps[lastTimeStampIndex];
        if (newPortcallTimestamp) {
          newPortcallTimestamp.id = null;
          newPortcallTimestamp.portOfCall = this.portIdToPortPipe.transform(newPortcallTimestamp.portOfCall as number, this.ports);
          newPortcallTimestamp.portPrevious = this.portIdToPortPipe.transform(newPortcallTimestamp.portPrevious as number, this.ports);
          newPortcallTimestamp.portNext = this.portIdToPortPipe.transform(newPortcallTimestamp.portNext as number, this.ports);
          newPortcallTimestamp.terminal = this.terminalIdToTerminalPipe.transform(newPortcallTimestamp.terminal as number, this.terminals);

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
  }

  addComment(timestamp: PortcallTimestamp) {
    this.dialogService.open(TimestampCommentDialogComponent, {
      header: 'Add change comment to port call event',
      width: '50%', data: {timestamp: timestamp, delayCode: this.delayCodes, editMode: false}
    });
  }
}



