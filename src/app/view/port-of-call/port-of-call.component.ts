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
  portOptions: SelectItem[] = [];

  @Output() portOfCallNotifier: EventEmitter<Port> = new EventEmitter<Port>()

  constructor(private portService: PortService,
              private translate: TranslateService,
              private portFilterService: TransportCallFilterService,
              public globals: Globals) {
  }

  ngOnInit(): void {
    this.updatePortOfcallOptions();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updatePortOfcallOptions();
    });
  }

  selectPortOfCall = () => {
    this.portOfCallNotifier.emit(this.portOfCall);
    this.portFilterService.updatePortFilter(this.portOfCall)
  };

  updatePortOfcallOptions() {
    this.portService.getPorts().subscribe(ports => {
      this.globals.ports = ports;
      this.portOptions = [];
      this.portOptions.push({label: this.translate.instant('general.port.select'), value: null});
      ports.forEach(port => {
        this.portOptions.push({label: port.UNLocationName, value: port});
      });
    });
  }

}
