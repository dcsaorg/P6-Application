import {Component} from '@angular/core';
import {Port} from "../../model/portCall/port";
import {TransportCall} from "../../model/jit/transport-call";
import {Timestamp} from '../../model/jit/timestamp';
import {ActivatedRoute} from '@angular/router';
import {TransportCallService} from "../../controller/services/jit/transport-call.service";
import {PortService} from "../../controller/services/base/port.service";
import { take } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  portOfCall: Port;
  transportCallSelected: TransportCall;

  transportCallID: string;
  private sub: any;

  constructor(private route: ActivatedRoute, private portService: PortService, private transportCallService: TransportCallService) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.transportCallID = params['id'];
      this.transportCallService.getTransportCalls().pipe(take(1)).subscribe(transportCalls => {
        this.transportCallSelected = transportCalls.find(x => x.transportCallID === this.transportCallID);
      });
    });
  }

  portOfCallChangedHandler = ($portOfCall: Port) => this.portOfCall = $portOfCall;

  transportCallSelectHandler = ($transportCall: TransportCall) => {
    this.transportCallSelected = $transportCall;
  }

}
