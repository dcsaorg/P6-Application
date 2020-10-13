import {Component, OnInit} from '@angular/core';
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {PortcallTimestampService} from "../portcall-timestamp.service";
import {SelectItem} from "primeng/api";
import {PortcallTimestampType} from "../model/portcall-timestamp-type.enum";

@Component({
  selector: 'app-timestamp-editor',
  templateUrl: './timestamp-editor.component.html',
  styleUrls: ['./timestamp-editor.component.scss']
})
export class TimestampEditorComponent implements OnInit {
  timestamps: PortcallTimestamp[];
  timestampTypes: SelectItem[];
  commTimestampDate: Date;
  eventTimestamp: Date;
  ports: SelectItem[];
  directions: SelectItem[];
  terminals: SelectItem[];

  constructor(private portcallTimestampService: PortcallTimestampService) { }

  ngOnInit(): void {
    const portcallTimestamps = this.portcallTimestampService.getPortcallTimestamps();
    const lastTimeStampIndex = portcallTimestamps.length - 1;
    const newPortcallTimestamp: PortcallTimestamp = portcallTimestamps[lastTimeStampIndex];
    this.timestamps = [newPortcallTimestamp];

    this.timestampTypes = [];
    for (let item in PortcallTimestampType) {
      this.timestampTypes.push({label: PortcallTimestampType[item], value: item})
    }

    this.commTimestampDate = new Date(newPortcallTimestamp.communicationTimestamp);
    this.eventTimestamp = new Date(newPortcallTimestamp.eventTimestamp);

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

}
