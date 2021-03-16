import {Injectable} from '@angular/core';
import {Config} from "../../../model/base/config";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BACKEND_URL} from "../../../../environments/environment";
import {StaticConfigService} from "../static/static-config.service";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly CONFIG_URL: string;

  constructor(private httpClient: HttpClient, private staticConfigService: StaticConfigService) {
    this.CONFIG_URL = BACKEND_URL + '/application';

  }

  getConfig() : Observable<Config> {
    return this.staticConfigService.getConfig();
  }

  getConfigs = (): Observable<Config> => this.staticConfigService.getConfig();
}
