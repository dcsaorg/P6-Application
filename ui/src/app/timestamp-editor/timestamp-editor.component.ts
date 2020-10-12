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

  constructor(private portcallTimestampService: PortcallTimestampService) { }

  ngOnInit(): void {
    const portcallTimestamps = this.portcallTimestampService.getPortcallTimestamps();
    const lastTimeStampIndex = portcallTimestamps.length - 1;
    const newPortcallTimestamp: PortcallTimestamp = portcallTimestamps[lastTimeStampIndex];
    this.timestamps = [newPortcallTimestamp];
    this.timestampTypes = [
      {label: 'ATA-B', value: PortcallTimestampType.ATA_B},
      {label: 'ETA-B', value: PortcallTimestampType.ETA_B}
    ]
    this.commTimestampDate = new Date(newPortcallTimestamp.communicationTimestamp)
    this.eventTimestamp = new Date(newPortcallTimestamp.eventTimestamp)
  }

}
