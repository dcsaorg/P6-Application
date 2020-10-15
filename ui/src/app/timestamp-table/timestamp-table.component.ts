import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {PortcallTimestampService} from "../portcall-timestamp.service";

@Component({
  selector: 'app-timestamp-table',
  templateUrl: './timestamp-table.component.html',
  styleUrls: ['./timestamp-table.component.scss']
})
export class TimestampTableComponent implements OnInit, OnChanges {
  timestamps: PortcallTimestamp[];

  @Input('vesselId') vesselId: number;

  constructor(private portcallTimestampService: PortcallTimestampService) { }

  ngOnInit(): void {
    this.timestamps = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.timestamps = this.portcallTimestampService.getPortcallTimestamps(this.vesselId);
  }
}
