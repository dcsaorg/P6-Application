import {Injectable} from '@angular/core';
import {Config} from "../../model/config";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BACKEND_URL} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly CONFIG_URL: string;

  constructor(private httpClient: HttpClient) {
    this.CONFIG_URL = BACKEND_URL + '/application';
  }

  getConfig() : Observable<Config> {
    return this.httpClient.get<Config>(this.CONFIG_URL);
  }

  getConfigs = (): Observable<Config> => this.httpClient.get<Config>(this.CONFIG_URL);
}
