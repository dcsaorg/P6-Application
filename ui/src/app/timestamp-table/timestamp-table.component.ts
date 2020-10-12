import { Component, OnInit } from '@angular/core';
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {PortcallTimestampService} from "../portcall-timestamp.service";

@Component({
  selector: 'app-timestamp-table',
  templateUrl: './timestamp-table.component.html',
  styleUrls: ['./timestamp-table.component.scss']
})
export class TimestampTableComponent implements OnInit {
  timestamps: PortcallTimestamp[];

  constructor(private portcallTimestampService: PortcallTimestampService) { }

  ngOnInit(): void {
    this.timestamps = this.portcallTimestampService.getPortcallTimestamps();
  }
}
