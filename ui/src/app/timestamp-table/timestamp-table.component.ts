import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {PortcallTimestampService} from "../portcall-timestamp.service";
import {Observable} from "rxjs";
import {PortService} from "../port.service";
import {Port} from "../model/port";

@Component({
  selector: 'app-timestamp-table',
  templateUrl: './timestamp-table.component.html',
  styleUrls: ['./timestamp-table.component.scss']
})
export class TimestampTableComponent implements OnInit, OnChanges {
  $timestamps: Observable<PortcallTimestamp[]>;

  @Input('vesselId') vesselId: number;
  @Input('portCallTimeStampAdded') portCallTimeStampAdded: PortcallTimestamp;

  ports: Port[] = [];

  constructor(private portcallTimestampService: PortcallTimestampService, private portService: PortService) {
  }

  ngOnInit(): void {
    this.portService.getPorts().subscribe(ports => this.ports = ports);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.$timestamps = this.portcallTimestampService.getPortcallTimestamps(this.vesselId);
  }
}
