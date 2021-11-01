import {Component} from '@angular/core';
import {Port} from "../model/portCall/port";
import {TranslateService} from "@ngx-translate/core";
import {TransportCall} from "../model/jit/transport-call";
import { Timestamp } from '../model/jit/timestamp';

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
}
