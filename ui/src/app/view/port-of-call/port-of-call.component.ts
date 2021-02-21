import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Port} from "../../model/base/port";
import {SelectItem} from "primeng/api";
import {PortService} from "../../controller/services/base/port.service";
import {translate} from "@angular/localize/src/translate";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";

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
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.updatePortOfcallOptions();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updatePortOfcallOptions();
    });
  }

  selectPortOfCall = () => this.portOfCallNotifier.emit(this.portOfCall);

  updatePortOfcallOptions() {
    this.portService.getPorts().subscribe(ports => {
      this.portOptions = [];
      this.portOptions.push({ label: this.translate.instant('general.port.select'), value: null });
      ports.forEach(port => {
        this.portOptions.push({label: port.unLocode, value: port});
      });
    });
  }

}
