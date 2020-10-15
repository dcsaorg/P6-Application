import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {PortcallTimestampService} from "../portcall-timestamp.service";
import {MessageService, SelectItem} from "primeng/api";
import {PortcallTimestampType} from "../model/portcall-timestamp-type.enum";
import {BehaviorSubject} from "rxjs";
import {PortService} from "../port.service";
import {TerminalService} from "../terminal.service";

@Component({
  selector: 'app-timestamp-editor',
  templateUrl: './timestamp-editor.component.html',
  styleUrls: ['./timestamp-editor.component.scss']
})
export class TimestampEditorComponent implements OnInit, OnChanges {
  @Input('vesselId') vesselId: number;

  $timestamps: BehaviorSubject<PortcallTimestamp[]>;

  timestampTypes: SelectItem[];
  logOfTimestamp: Date;
  eventTimestamp: Date;
  ports: SelectItem[];
  directions: SelectItem[];
  terminals: SelectItem[];
  newTimestamp: PortcallTimestamp;

  constructor(private portcallTimestampService: PortcallTimestampService,
              private portService: PortService, private messageService: MessageService,
              private terminalService: TerminalService) {
  }

  ngOnInit(): void {
    this.newTimestamp = {
      logOfTimestamp: '',
      eventTimestamp: new Date().toISOString(),
      classifierCode: '',
      direction: '',
      eventTypeCode: '',
      locationId: '',
      portPrevious: null,
      portOfCall: null,
      portNext: null,
      terminalId: '',
      timestampType: null
    }
    this.$timestamps = new BehaviorSubject([]);
    this.$timestamps.next([this.newTimestamp])
    this.timestampTypes = [];

    this.ports = [];
    this.portService.getPorts().subscribe(ports => {
      ports.forEach(port => {
        this.ports.push({label: port.unLocode, value: port})
      });
    });

    this.directions = [
      {label: 'N', value: 'N'},
      {label: 'E', value: 'E'},
      {label: 'S', value: 'S'},
      {label: 'W', value: 'W'}
    ]

    this.terminals = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.portcallTimestampService.getPortcallTimestamps(this.vesselId).subscribe(portCallTimeStamps => {
      const lastTimeStampIndex = portCallTimeStamps.length - 1;
      const newPortcallTimestamp: PortcallTimestamp = portCallTimeStamps[lastTimeStampIndex];
      if (newPortcallTimestamp) {
        this.$timestamps.next([newPortcallTimestamp]);
        this.logOfTimestamp = new Date(newPortcallTimestamp.logOfTimestamp);
        this.eventTimestamp = new Date(newPortcallTimestamp.eventTimestamp);
      } else {
        this.logOfTimestamp = new Date();
        this.eventTimestamp = new Date();
      }

      this.timestampTypes = [];
      for (let item in PortcallTimestampType) {
        this.timestampTypes.push({label: PortcallTimestampType[item], value: item})
      }
    });

  }

  savePortcallTimestamp(portcallTimestamp : PortcallTimestamp, vesselId: number){
    this.portcallTimestampService.addPortcallTimestamp(portcallTimestamp, vesselId).subscribe((portcalltimestamp:PortcallTimestamp) =>{
      this.messageService.add({
        key: 'TimestampAddSuccess',
        severity: 'success',
        summary: 'Successfully added new port call timestamp to vessel',
        detail: ''
      });
    }, error => this.messageService.add({
      key: 'TimestampAddError',
      severity: 'error',
      summary: 'Error while adding port call timestamp',
      detail: error.message
    }));
  }

  selectPortOfCall(portId: number) {
    this.terminals = [];
    this.terminalService.getTerminals(portId).subscribe(terminals => {
      terminals.forEach(terminal => {
        this.terminals.push({label: terminal.smdgCode, value: terminal});
      });
    });
  }

}
