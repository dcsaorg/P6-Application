import {Component} from '@angular/core';
import {PortcallTimestamp} from "./model/portcall-timestamp";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui';
  vesselId: number
  portCallTimeStampAdded: PortcallTimestamp;

  vesselChangedHandler($vesselId: number) {
    this.vesselId = $vesselId
  }

  timeStampAddedHandler($portCallTimeStampAdded: PortcallTimestamp) {
    this.portCallTimeStampAdded = $portCallTimeStampAdded;
  }
}
