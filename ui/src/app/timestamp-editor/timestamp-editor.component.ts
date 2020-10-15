import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {PortcallTimestampService} from "../portcall-timestamp.service";
import {SelectItem} from "primeng/api";
import {PortcallTimestampType} from "../model/portcall-timestamp-type.enum";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-timestamp-editor',
  templateUrl: './timestamp-editor.component.html',
  styleUrls: ['./timestamp-editor.component.scss']
})
export class TimestampEditorComponent implements OnInit, OnChanges {
  $timestamps: BehaviorSubject<PortcallTimestamp[]>;
  timestampTypes: SelectItem[];
  logOfCall: Date;
  eventTimestamp: Date;
  ports: SelectItem[];
  directions: SelectItem[];
  terminals: SelectItem[];
  @Input('vesselId') vesselId: number;
  newTimestamp: PortcallTimestamp;

  constructor(private portcallTimestampService: PortcallTimestampService) {
  }

  ngOnInit(): void {
    this.newTimestamp = {
      logOfCall: '',
      eventTimestamp: new Date().toDateString(),
      classifierCode: '',
      direction: '',
      eventTypeCode: '',
      locationId: '',
      nextPort: '',
      portFrom: '',
      portTo: '',
      terminalId: '',
      timestampType: null
    }
    this.$timestamps = new BehaviorSubject([]);
    this.$timestamps.next([this.newTimestamp])
    this.timestampTypes = [];

    this.ports = [
      {label: 'DEBRV', value: {code: 'DE BRV', name: 'BREMERHAVEN'}},
      {label: 'DEHAM', value: {code: 'DE HAM', name: 'HAMBURG'}},
      {label: 'ESALG', value: {code: 'ES ALF', name: 'ALGECIRAS'}},
      {label: 'ESVLC', value: {code: 'ES VLC', name: 'VALENCIA'}},
      {label: 'HKHKG', value: {code: 'HK HKG', name: 'HONGKONG'}},
      {label: 'NLANR', value: {code: 'NL ANR', name: 'ANTWERP'}},
      {label: 'NLRTM', value: {code: 'NL RTM', name: 'ROTTERDAM'}},
      {label: 'SGSIN', value: {code: 'SG SIN', name: 'SINGAPORE'}},
    ]
    this.directions = [
      {label: 'N', value: 'north'},
      {label: 'E', value: 'east'},
      {label: 'S', value: 'south'},
      {label: 'W', value: 'west'}
    ]

    this.terminals = [
      {label: 'CTA', value: {code: 'CTA ', name: 'ALTENWERDER'}},
      {label: 'CTB', value: {code: 'CTB ', name: 'BUCHARDKAI'}},
      {label: 'CTT', value: {code: 'CTT ', name: 'TOLLERORT'}},
      {label: 'EGH', value: {code: 'EGH ', name: 'EUROGATE'}},
    ]
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.portcallTimestampService.getPortcallTimestamps(this.vesselId).subscribe(portCallTimeStamps => {
      const lastTimeStampIndex = portCallTimeStamps.length - 1;
      const newPortcallTimestamp: PortcallTimestamp = portCallTimeStamps[lastTimeStampIndex];
      if (newPortcallTimestamp) {
        this.$timestamps.next([newPortcallTimestamp]);
        this.logOfCall = new Date(newPortcallTimestamp.logOfCall);
        this.eventTimestamp = new Date(newPortcallTimestamp.eventTimestamp);
      } else {
        this.logOfCall = new Date();
        this.eventTimestamp = new Date();
      }

      this.timestampTypes = [];
      for (let item in PortcallTimestampType) {
        this.timestampTypes.push({label: PortcallTimestampType[item], value: item})
      }
    });

  }
}
