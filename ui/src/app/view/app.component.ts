import {Component, OnInit} from '@angular/core';
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {PortService} from "../controller/port.service";
import {TerminalService} from "../controller/terminal.service";
import {Port} from "../model/port";
import {Terminal} from "../model/terminal";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ui';
  vesselId: number
  portCallTimeStampAdded: PortcallTimestamp;
  ports: Port[] = [];
  terminals : Terminal[] = [];

  constructor(private portService: PortService, private  terminalService: TerminalService) {}

  ngOnInit(): void {
    this.portService.getPorts().subscribe(ports => this.ports = ports);
    this.terminalService.getAllTerminals().subscribe(terminals => this.terminals = terminals);
  }

  vesselChangedHandler($vesselId: number) {
    this.vesselId = $vesselId
  }

  timeStampAddedHandler($portCallTimeStampAdded: PortcallTimestamp) {
    this.portCallTimeStampAdded = $portCallTimeStampAdded;
  }
}
