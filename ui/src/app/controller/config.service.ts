import {Injectable} from '@angular/core';
import ConfigJson from '../../assets/config.json';
import {Config} from "../model/config";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() {
  }

  getConfig() : Config {
    return ConfigJson;
  }
}
