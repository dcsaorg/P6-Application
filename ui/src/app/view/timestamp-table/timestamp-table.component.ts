import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../../model/portcall-timestamp";
import {PortcallTimestampService} from "../../controller/portcall-timestamp.service";
import {Observable} from "rxjs";
import {Port} from "../../model/port";
import {Terminal} from "../../model/terminal";

@Component({
  selector: 'app-timestamp-table',
  templateUrl: './timestamp-table.component.html',
  styleUrls: ['./timestamp-table.component.scss']
})
export class TimestampTableComponent implements OnChanges {
  $timestamps: Observable<PortcallTimestamp[]>;

  @Input('vesselId') vesselId: number;
  @Input('ports') ports: Port[];
  @Input('terminals') terminals: Terminal[];
  @Input('timestamps') timestamps: PortcallTimestamp[];

  constructor(private portcallTimestampService: PortcallTimestampService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.$timestamps = this.portcallTimestampService.getPortcallTimestamps(this.vesselId);
  }
}
