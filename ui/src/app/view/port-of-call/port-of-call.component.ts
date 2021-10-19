import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Port} from "../../model/portCall/port";
import {SelectItem} from "primeng/api";
import {PortService} from "../../controller/services/base/port.service";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {Globals} from "../../model/portCall/globals";
import {TerminalService} from "../../controller/services/base/terminal.service";
import {Terminal} from "../../model/portCall/terminal";
import { TransportCallFilterService } from 'src/app/controller/services/base/transport-call-filter.service';


@Component({
  selector: 'app-port-of-call',
  templateUrl: './port-of-call.component.html',
  styleUrls: ['./port-of-call.component.scss']
})
export class PortOfCallComponent implements OnInit {
  portOfCall: Port;
  terminal: Terminal;
  terminalOptions: SelectItem[] = [];
  portOptions: SelectItem[] = [];

  @Output() portOfCallNotifier: EventEmitter<Port> = new EventEmitter<Port>()

  constructor(private portService: PortService,
              private terminalService: TerminalService,
              private translate: TranslateService,
              private portFilterService: TransportCallFilterService,
              public globals: Globals) {
  }

  ngOnInit(): void {
    this.updatePortOfcallOptions();
    //this.updateTerminalOptions();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updatePortOfcallOptions();
    });
  }

  selectPortOfCall = () => {
    this.updateTerminalOptions(this.portOfCall?.unLocationCode); // NULL?
    this.portOfCallNotifier.emit(this.portOfCall);
    this.portFilterService.updatePortFilter(this.portOfCall)
  };
  selectTerminal = () => {
    this.portFilterService.updateTerminalFilter(this.terminal)
  }

  updateTerminalOptions(unLocationCode:string) {

    this.terminalService.getTerminalsByUNLocationCode(unLocationCode).subscribe(terminals => {
      this.globals.terminals = terminals;
      this.terminalOptions = [];
      this.terminalOptions.push({label: this.translate.instant('general.terminal.select'), value: null});
      terminals.forEach(terminal => {
        if ((this.portOfCall)  ) {
          this.terminalOptions.push({label: terminal.facilitySMDGCode, value: terminal})
        }
      });
    })
  
  }

  updatePortOfcallOptions() {
    this.portService.getPorts().subscribe(ports => {
      this.globals.ports = ports;
      this.portOptions = [];
      this.portOptions.push({label: this.translate.instant('general.port.select'), value: null});
      ports.forEach(port => {
        this.portOptions.push({label: port.unLocationName, value: port});
      });
    });
  }

}
