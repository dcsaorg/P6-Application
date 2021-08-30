import { Component } from '@angular/core';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import {Port} from "../../model/portCall/port";
import {TransportCall} from "../../model/ovs/transport-call";
import { Timestamp } from '../../model/ovs/timestamp';
import { Router } from '@angular/router';


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

  constructor(private router: Router) {
  }


  vesselChangedHandler = ($vesselId: string) => this.vesselId =  parseInt($vesselId) ;
  vesselSavedHandler = ($vesselSavedId: string) => this.vesselSavedId = parseInt($vesselSavedId);

  timeStampAddedHandler = ($portCallTimeStampAdded: Timestamp) => this.portCallTimeStampAdded = $portCallTimeStampAdded;

  timestampDeletedHandler = ($portCallTimestampDeleted: Timestamp) => this.portCallTimeStampDeleted = $portCallTimestampDeleted;

  timestampRespondedHandler = ($portCallTimestampResponded: Timestamp) => this.portCallTimeStampResponded = $portCallTimestampResponded;

  portOfCallChangedHandler = ($portOfCall: Port) => this.portOfCall = $portOfCall;

  transportCallSelectHandler = ($transportCall: TransportCall) => {this.transportCallSelected = $transportCall;};

  onLogout(): void {
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    let userPool = new CognitoUserPool(poolData);
    let cognitoUser = userPool.getCurrentUser();
    cognitoUser?.signOut();
    this.router.navigate(["signin"])
  }

}
