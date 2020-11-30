import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Port} from "../../model/port";
import {SelectItem} from "primeng/api";
import {PortService} from "../../controller/services/port.service";

@Component({
  selector: 'app-port-of-call',
  templateUrl: './port-of-call.component.html',
  styleUrls: ['./port-of-call.component.scss']
})
export class PortOfCallComponent implements OnInit {
  portOfCall: Port;
  portOptions: SelectItem[] = [];

  @Output() portOfCallNotifier: EventEmitter<Port> = new EventEmitter<Port>()

  constructor(private portService: PortService) {
  }

  ngOnInit(): void {
    this.portOptions.push({label: 'Select port', value: null})
    this.portService.getPorts().subscribe(ports => ports.forEach(port =>
      this.portOptions.push({label: port.unLocode, value: port}))
    );
  }

  selectPortOfCall = () => this.portOfCallNotifier.emit(this.portOfCall);

}
