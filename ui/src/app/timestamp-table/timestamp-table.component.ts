import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {PortcallTimestampService} from "../portcall-timestamp.service";
import {Observable} from "rxjs";
import {PortService} from "../port.service";
import {Port} from "../model/port";
import {Terminal} from "../model/terminal";
import {TerminalService} from "../terminal.service";

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
  terminals : Terminal[] = [];

  constructor(private portcallTimestampService: PortcallTimestampService, private portService: PortService, private  terminalService : TerminalService) {
  }

  ngOnInit(): void {
    this.portService.getPorts().subscribe(ports => this.ports = ports);
    this.terminalService.getAllTerminals().subscribe(terminals => this.terminals = terminals);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.$timestamps = this.portcallTimestampService.getPortcallTimestamps(this.vesselId);
  }
}
