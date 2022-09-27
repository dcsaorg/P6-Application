import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Port} from '../../model/portCall/port';
import {PortService} from '../../controller/services/base/port.service';
import {Globals} from '../../model/portCall/globals';
import { TransportCallFilterService } from 'src/app/controller/services/base/transport-call-filter.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-port-of-call',
  templateUrl: './port-of-call.component.html',
  styleUrls: ['./port-of-call.component.scss']
})
export class PortOfCallComponent implements OnInit {
  portOfCall: Port = null;
  portOfCalls$: Observable<Port[]>;

  @Output() portOfCallNotifier: EventEmitter<Port> = new EventEmitter<Port>();

  constructor(private portService: PortService,
              private portFilterService: TransportCallFilterService,
              public globals: Globals) {
  }

  ngOnInit(): void {
    this.portOfCalls$ = this.portService.getPorts();
  }

  selectPortOfCall = () => {
    this.portOfCallNotifier.emit(this.portOfCall);
    this.portFilterService.updatePortFilter(this.portOfCall);
  }

}
