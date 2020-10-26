import {Injectable, OnInit} from '@angular/core';
import {Config} from "../model/config";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConfigService implements OnInit {

  config: Config;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.httpClient.get<Config>("assets/config.json").subscribe(data =>{
      this.config = data;
    })
  }

  getConfig() : Config {
    return this.config;
  }
}
