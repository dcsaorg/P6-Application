import { Injectable } from '@angular/core';
import {HttpClient, HttpBackend} from "@angular/common/http";
import {Observable} from "rxjs";
import {Config} from "../../../model/ovs/config";


@Injectable({
  providedIn: 'root'
})
export class StaticConfigService {
  private readonly CONFIG_FILE: string;
  private httpClient: HttpClient;

  constructor(private handler: HttpBackend) {
    this.CONFIG_FILE = "assets/config.json"
    // manually instantiate this to avoid a circular dependencies between ConfigService
    // and AuthService/AuthInterceptor.
    this.httpClient = new HttpClient(handler);
  }

  getConfig= (): Observable<Config> => this.httpClient.get<Config>(this.CONFIG_FILE);

}
