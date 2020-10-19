import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../../model/portcall-timestamp";
import {PortcallTimestampService} from "../../controller/portcall-timestamp.service";
import {MessageService, SelectItem} from "primeng/api";
import {PortcallTimestampType} from "../../model/portcall-timestamp-type.enum";
import {BehaviorSubject} from "rxjs";
import {PortIdToPortPipe} from "../../controller/port-id-to-port.pipe";
import {PortCallTimestampTypeToStringPipe} from "../../controller/port-call-timestamp-type-to-string.pipe";
import {Port} from "../../model/port";
import {TerminalIdToTerminalPipe} from "../../controller/terminal-id-to-terminal.pipe";
import {Terminal} from "../../model/terminal";
import {DialogService} from "primeng/dynamicdialog";
import {TimestampCommentDialogComponent} from "../timestamp-comment-dialog/timestamp-comment-dialog.component";
import {DelayCode} from "../../model/delayCode";


@Component({
  selector: 'app-timestamp-editor',
  templateUrl: './timestamp-editor.component.html',
  styleUrls: ['./timestamp-editor.component.scss'],
  providers: [PortIdToPortPipe, PortCallTimestampTypeToStringPipe, TerminalIdToTerminalPipe, DialogService]
})
export class TimestampEditorComponent implements OnInit, OnChanges {
  @Input('vesselId') vesselId: number;
  @Input('ports') ports: Port[];
  @Input('terminals') terminals: Terminal[];
  @Output('timeStampAddedNotifier') timeStampAddedNotifier: EventEmitter<PortcallTimestamp> = new EventEmitter<PortcallTimestamp>()
  @Input('delayCodes') delayCodes: DelayCode[];

  $timestamps: BehaviorSubject<PortcallTimestamp[]>;

  timestampTypes: SelectItem[];
  portOptions: SelectItem[] = [];
  directions: SelectItem[];
  terminalOptions: SelectItem[] = [];
  defaultTimestamp: PortcallTimestamp = {
    logOfTimestamp: new Date(),
    eventTimestamp: new Date(),
    direction: null,
    locationId: '',
    portPrevious: null,
    portOfCall: null,
    portNext: null,
    terminal: null,
    timestampType: null,
    classifierCode: '',
    eventTypeCode: ''
  };

  constructor(private portcallTimestampService: PortcallTimestampService,
              private messageService: MessageService,
              private portIdToPortPipe: PortIdToPortPipe,
              private portCallTimestampTypePipe: PortCallTimestampTypeToStringPipe,
              private terminalIdToTerminalPipe: TerminalIdToTerminalPipe,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.$timestamps = new BehaviorSubject([]);

    this.portOptions.push({label: 'Select port', value: null})
    this.ports.forEach(port => {
      this.portOptions.push({label: port.unLocode, value: port})
    });

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
  }

  savePortcallTimestamp(portcallTimestamp: PortcallTimestamp, vesselId: number) {
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

  selectPortOfCall(portId: number) {
    this.terminalOptions = [{label: 'Select terminal', value: null}];
    this.terminals.forEach(terminal => {
      console.log(terminal);
      if (terminal.port === portId) {
        this.terminalOptions.push({label: terminal.smdgCode, value: terminal});
      }
    })
  }

  validatePortOfCallTimestamp(timestamp: PortcallTimestamp): boolean {
    return !(timestamp.timestampType &&
      timestamp.direction &&
      timestamp.portNext &&
      timestamp.portPrevious &&
      timestamp.portOfCall &&
      timestamp.terminal);
  }

  private updatePortCallTimeStampToBeEdited() {
    this.portcallTimestampService.getPortcallTimestamps(this.vesselId).subscribe(portCallTimeStamps => {
      const lastTimeStampIndex = portCallTimeStamps.length - 1;
      const newPortcallTimestamp: PortcallTimestamp = portCallTimeStamps[lastTimeStampIndex];
      if (newPortcallTimestamp) {
        newPortcallTimestamp.portOfCall = this.portIdToPortPipe.transform(newPortcallTimestamp.portOfCall as number, this.ports);
        newPortcallTimestamp.portPrevious = this.portIdToPortPipe.transform(newPortcallTimestamp.portPrevious as number, this.ports);
        newPortcallTimestamp.portNext = this.portIdToPortPipe.transform(newPortcallTimestamp.portNext as number, this.ports);
        newPortcallTimestamp.terminal = this.terminalIdToTerminalPipe.transform(newPortcallTimestamp.terminal as number, this.terminals);
        newPortcallTimestamp.logOfTimestamp = new Date(newPortcallTimestamp.logOfTimestamp);
        newPortcallTimestamp.eventTimestamp = new Date(newPortcallTimestamp.eventTimestamp);
        this.selectPortOfCall(newPortcallTimestamp.portOfCall.id);

        this.$timestamps.next([newPortcallTimestamp]);
      } else {
        // if there is no entry
        this.$timestamps.next([this.defaultTimestamp]);
      }
    });
  }

  addComment(timestamp: PortcallTimestamp) {

    this.dialogService.open(TimestampCommentDialogComponent, {
      header: 'Add changeComment to timestamp event',
      width: '50%', data: {timestamp, delayCode: this.delayCodes}
    });
  }
}



