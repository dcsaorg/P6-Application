import {Injectable} from '@angular/core';
import {Config} from "../../../model/ovs/config";
import {Observable} from "rxjs";
import {BACKEND_URL} from "../../../../environments/environment";
import {StaticConfigService} from "../static/static-config.service";
import {Globals} from "../../../model/portCall/globals"

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly CONFIG_URL: string;

  constructor(private globals: Globals, private staticConfigService: StaticConfigService) {
    this.CONFIG_URL = BACKEND_URL + '/application';

  }

  getConfig() : Observable<Config> {
    return this.staticConfigService.getConfig();
  }

  getConfigs = (): Observable<Config> => this.staticConfigService.getConfig();

  load(): Promise<void> {
    return new Promise((resolve) => {
      this.getConfig().subscribe((config) => {
           this.globals.config = config;
           resolve();
       });
    });

  }
}
