import {Component} from '@angular/core';
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {Port} from "../model/port";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  vesselId: number
  portOfCall: Port
  portCallTimeStampAdded: PortcallTimestamp;
  portCallTimeStampDeleted: PortcallTimestamp;
  portCallTimeStampResponded: PortcallTimestamp;

  constructor() {
  }

  vesselChangedHandler = ($vesselId: number) => this.vesselId = $vesselId;

  timeStampAddedHandler = ($portCallTimeStampAdded: PortcallTimestamp) => this.portCallTimeStampAdded = $portCallTimeStampAdded;

  timestampDeletedHandler = ($portCallTimestampDeleted: PortcallTimestamp) => this.portCallTimeStampDeleted = $portCallTimestampDeleted;

  timestampRespondedHandler = ($portCallTimestampResponded: PortcallTimestamp) => this.portCallTimeStampResponded = $portCallTimestampResponded;

  portOfCallChangedHandler = ($portOfCall: Port) => this.portOfCall = $portOfCall;
}
