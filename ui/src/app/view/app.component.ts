import {Component, OnInit} from '@angular/core';
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {PortService} from "../controller/port.service";
import {TerminalService} from "../controller/terminal.service";
import {Port} from "../model/port";
import {Terminal} from "../model/terminal";
import {DelayCode} from "../model/delayCode";
import {DelayCodeService} from "../controller/delay-code.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  vesselId: number
  portCallTimeStampAdded: PortcallTimestamp;
  ports: Port[] = [];
  terminals : Terminal[] = [];
  delayCodes : DelayCode[] = [];

  constructor(private portService: PortService, private  terminalService: TerminalService, private delayCodeService: DelayCodeService) {}

  ngOnInit(): void {
    this.portService.getPorts().subscribe(ports => this.ports = ports);
    this.terminalService.getAllTerminals().subscribe(terminals => this.terminals = terminals);
    this.delayCodeService.getAllDelayCodes().subscribe(delaycodes => this.delayCodes = delaycodes)
  }

  vesselChangedHandler($vesselId: number) {
    this.vesselId = $vesselId
  }

  timeStampAddedHandler($portCallTimeStampAdded: PortcallTimestamp) {
    this.portCallTimeStampAdded = $portCallTimeStampAdded;
  }
}
