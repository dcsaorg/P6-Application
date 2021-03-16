import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Port} from "../../model/base/port";
import {SelectItem} from "primeng/api";
import {PortService} from "../../controller/services/base/port.service";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {Globals} from "../../model/base/globals";
import {TerminalService} from "../../controller/services/base/terminal.service";
import {Terminal} from "../../model/base/terminal";


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
              public globals: Globals) {
  }

  ngOnInit(): void {
    this.updatePortOfcallOptions();
    this.updateTerminalOptions();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updatePortOfcallOptions();
    });
  }

  selectPortOfCall = () => {
    this.updateTerminalOptions();
    this.portOfCallNotifier.emit(this.portOfCall);
  };
  selectTerminal = () => {
  }

  updateTerminalOptions() {
    this.terminalService.getTerminals().subscribe(terminals => {
      this.globals.terminals = terminals;
      this.terminalOptions = [];
      this.terminalOptions.push({label: this.translate.instant('general.terminal.select'), value: null});
      terminals.forEach(terminal => {
        if (terminal.port == this.portOfCall.id) {
          this.terminalOptions.push({label: terminal.smdgCode, value: terminal})
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
        this.portOptions.push({label: port.unLocode, value: port});
      });

    });
  }

}
