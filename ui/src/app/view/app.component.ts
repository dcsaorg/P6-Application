import {Component} from '@angular/core';
import {PortcallTimestamp} from "../model/portCall/portcall-timestamp";
import {Port} from "../model/portCall/port";
import {TranslateService} from "@ngx-translate/core";
import {TransportCall} from "../model/ovs/transport-call";
import {take} from "rxjs/operators";

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
  portCallTimeStampAdded: PortcallTimestamp;
  portCallTimeStampDeleted: PortcallTimestamp;
  portCallTimeStampResponded: PortcallTimestamp;


  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  vesselChangedHandler = ($vesselId: number) => this.vesselId = $vesselId;
  vesselSavedHandler = ($vesselSavedId: number) => this.vesselSavedId = $vesselSavedId;

  timeStampAddedHandler = ($portCallTimeStampAdded: PortcallTimestamp) => this.portCallTimeStampAdded = $portCallTimeStampAdded;

  timestampDeletedHandler = ($portCallTimestampDeleted: PortcallTimestamp) => this.portCallTimeStampDeleted = $portCallTimestampDeleted;

  timestampRespondedHandler = ($portCallTimestampResponded: PortcallTimestamp) => this.portCallTimeStampResponded = $portCallTimestampResponded;

  portOfCallChangedHandler = ($portOfCall: Port) => this.portOfCall = $portOfCall;

  transportCallSelectHandler = ($transportCall: TransportCall) => {this.transportCallSelected = $transportCall;};


}
