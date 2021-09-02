import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Config} from "../../../model/ovs/config";


@Injectable({
  providedIn: 'root'
})
export class StaticConfigService {
  private readonly CONFIG_FILE: string;

  constructor(private httpClient: HttpClient) {
    this.CONFIG_FILE = "assets/config.json"
  }

  getConfig= (): Observable<Config> => this.httpClient.get<Config>(this.CONFIG_FILE);

}
