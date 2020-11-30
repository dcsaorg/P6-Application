import {Injectable} from '@angular/core';
import {Config} from "../../model/config";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config: Observable<Config>;

  constructor(private httpClient: HttpClient) {
      this.loadConfig();
  }

  private loadConfig() {
    this.config = this.httpClient.get<Config>("./assets/config.json");
  }

  getConfig() : Observable<Config> {
    return this.config;
  }
}
