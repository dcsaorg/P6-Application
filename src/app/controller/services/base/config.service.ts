import {Injectable} from '@angular/core';
import {Config} from "../../../model/jit/config";
import {Observable} from "rxjs";
import {StaticConfigService} from "../static/static-config.service";
import {Globals} from "../../../model/portCall/globals"
import Amplify from 'aws-amplify';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private globals: Globals, private staticConfigService: StaticConfigService) {}

  getConfig() : Observable<Config> {
    return this.staticConfigService.getConfig();
  }

  load(): Promise<void> {
    return new Promise((resolve) => {
      this.getConfig().subscribe((config) => {
           this.globals.config = config;
           Amplify.configure({
            Auth: {
                region: this.globals.config.authRegion,
                userPoolId: this.globals.config.authUserPoolId,
                userPoolWebClientId: this.globals.config.authUserPoolWebClientId,
                mandatorySignIn: true,
                RedirectUriSignIn : this.globals.config.authRedirectUriSignIn
            }
          });
           resolve();
       });
    });

  }
}
