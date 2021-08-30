import {Component} from '@angular/core';
import {PortcallTimestamp} from "../model/portCall/portcall-timestamp";
import {Port} from "../model/portCall/port";
import {TranslateService} from "@ngx-translate/core";
import {TransportCall} from "../model/ovs/transport-call";
import {take} from "rxjs/operators";
import { Timestamp } from '../model/ovs/timestamp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  vesselId: number;
  vesselSavedId: number;
  portOfCall: Port;
  transportCallSelected: TransportCall;
  portCallTimeStampAdded: Timestamp;
  portCallTimeStampDeleted: Timestamp;
  portCallTimeStampResponded: Timestamp;


  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  vesselChangedHandler = ($vesselId: string) => this.vesselId =  parseInt($vesselId) ;
  vesselSavedHandler = ($vesselSavedId: string) => this.vesselSavedId = parseInt($vesselSavedId);

  timeStampAddedHandler = ($portCallTimeStampAdded: Timestamp) => this.portCallTimeStampAdded = $portCallTimeStampAdded;

  timestampDeletedHandler = ($portCallTimestampDeleted: Timestamp) => this.portCallTimeStampDeleted = $portCallTimestampDeleted;

  timestampRespondedHandler = ($portCallTimestampResponded: Timestamp) => this.portCallTimeStampResponded = $portCallTimestampResponded;

  portOfCallChangedHandler = ($portOfCall: Port) => this.portOfCall = $portOfCall;

  transportCallSelectHandler = ($transportCall: TransportCall) => {this.transportCallSelected = $transportCall;};


}
