import {Port} from "../model/portCall/port";
import {TranslateService} from "@ngx-translate/core";
import {TransportCall} from "../model/jit/transport-call";
import { Timestamp } from '../model/jit/timestamp';
import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';
import { environment } from "src/environments/environment";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'amplify-angular-auth';
  user: CognitoUserInterface | undefined;
  authState: AuthState;
  authLocalState: boolean;
  vesselId: number;
  vesselSavedId: number;
  portOfCall: Port;
  transportCallSelected: TransportCall;
  portCallTimeStampAdded: Timestamp;
  portCallTimeStampDeleted: Timestamp;
  portCallTimeStampResponded: Timestamp;


  constructor(translate: TranslateService, private ref: ChangeDetectorRef) {
      translate.setDefaultLang('en');
      translate.use('en');

  }
  
  ngOnInit() {
    this.authLocalState = environment.authentication;
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;      
      this.ref.detectChanges();
    })
  }
  ngOnDestroy() {
    return onAuthUIStateChange;
  }
}
