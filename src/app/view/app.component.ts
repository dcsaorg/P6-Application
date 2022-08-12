import {Port} from "../model/portCall/port";
import {TranslateService} from "@ngx-translate/core";
import {TransportCall} from "../model/jit/transport-call";
import { Timestamp } from '../model/jit/timestamp';
import { Component, ChangeDetectorRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import {AuthService} from "../auth/auth.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  user: CognitoUserInterface | undefined;
  authState: AuthState;
  authLocalState: boolean;
  vesselId: number;
  portOfCall: Port;
  private stateChange;


  constructor(translate: TranslateService,
              private authService: AuthService,
              private ref: ChangeDetectorRef,
              private zone: NgZone,
              private router: Router) {
      translate.setDefaultLang('en');
      translate.use('en');
  }

  ngOnInit() {
    this.authLocalState = environment.authentication;
    this.stateChange = onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;
      this.zone.runTask(async () => {
          await this.authService.resolveToken()
          this.ref.detectChanges()
          this.router.navigate(['/dashboard'])
      });
    })
  }
  ngOnDestroy() {
    return this.stateChange;
  }
}
