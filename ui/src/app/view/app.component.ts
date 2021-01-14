import {Component} from '@angular/core';
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {Port} from "../model/port";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  vesselId: number;
  vesselSavedId: number;
  portOfCall: Port;
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
}
