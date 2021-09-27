import {Component} from '@angular/core';
import {CognitoUserPool} from 'amazon-cognito-identity-js';
import {environment} from 'src/environments/environment';
import {Port} from "../../model/portCall/port";
import {TransportCall} from "../../model/ovs/transport-call";
import {Timestamp} from '../../model/ovs/timestamp';
import {ActivatedRoute, Router} from '@angular/router';
import {TransportCallService} from "../../controller/services/ovs/transport-call.service";
import {take} from "rxjs/operators";
import {PortService} from "../../controller/services/base/port.service";
import {Globals} from "../../model/portCall/globals";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  vesselId: number;
  vesselSavedId: number;
  portOfCall: Port;
  transportCallSelected: TransportCall;
  portCallTimeStampAdded: Timestamp;
  portCallTimeStampDeleted: Timestamp;
  portCallTimeStampResponded: Timestamp;

  transportCallID: string;
  private sub: any;

  constructor(private router: Router, private route: ActivatedRoute, private globals: Globals, private portService: PortService, private transportCallService: TransportCallService) {
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.transportCallID = params['id'];
    });
    if (this.transportCallID) {
      console.log("ID: " + this.transportCallID);
      this.portService.getPorts().pipe().subscribe(ports => {
        this.globals.ports = ports;
        this.transportCallService.getTransportCalls().subscribe(transportCalls => {
          this.transportCallSelected = transportCalls.find(x => x.transportCallID == this.transportCallID);
        })
      })
    }
  }


  vesselChangedHandler = ($vesselId: string) => this.vesselId = parseInt($vesselId);
  vesselSavedHandler = ($vesselSavedId: string) => this.vesselSavedId = parseInt($vesselSavedId);

  timeStampAddedHandler = ($portCallTimeStampAdded: Timestamp) => this.portCallTimeStampAdded = $portCallTimeStampAdded;

  timestampDeletedHandler = ($portCallTimestampDeleted: Timestamp) => this.portCallTimeStampDeleted = $portCallTimestampDeleted;

  timestampRespondedHandler = ($portCallTimestampResponded: Timestamp) => this.portCallTimeStampResponded = $portCallTimestampResponded;

  portOfCallChangedHandler = ($portOfCall: Port) => this.portOfCall = $portOfCall;

  transportCallSelectHandler = ($transportCall: TransportCall) => {
    this.transportCallSelected = $transportCall;
  };

}
