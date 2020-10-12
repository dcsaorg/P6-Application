import {Injectable} from '@angular/core';
import {PortcallTimestamp} from "./model/portcall-timestamp";

@Injectable({
  providedIn: 'root'
})
export class PortcallTimestampService {

  constructor() {
  }

  getPortcallTimestamps = ():PortcallTimestamp[] => {
    return [];
  }

}
