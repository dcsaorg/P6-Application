import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Timestamp} from "../../../model/ovs/timestamp";
import {Globals} from "../../../model/portCall/globals";
import { PortcallTimestampType } from 'src/app/model/portCall/portcall-timestamp-type.enum';
import { PublisherRole } from 'src/app/model/enums/publisherRole';

@Injectable({
  providedIn: 'root'
})
export class TimestampService {
  private readonly TIMESTAMPS_URL: string;

  constructor(private httpClient: HttpClient, globals: Globals) {
    this.TIMESTAMPS_URL = globals.config.ovsBackendURL + "/timestamps";
  }

  addTimestamp = (timestamp: Timestamp): Observable<Timestamp> => {
    return this.httpClient.post<Timestamp>(this.TIMESTAMPS_URL, timestamp);
}

/*
Setting response for current publisher. 
Check the type of PortcallTimestampType recieved and set response for current publisher. 
Note: No need to response if an "Actual" is recieved
*/
public setResponseType(portCallTimestamp: Timestamp, role: PublisherRole) {

    let response: PortcallTimestampType = null;

    if((portCallTimestamp === undefined) || (role === undefined)){return;}
    
    // If I'm a carrier
    if (role === PublisherRole.CA || role === PublisherRole.AG || role === PublisherRole.VSL  ) {
      switch (portCallTimestamp.timestampType) {

        case PortcallTimestampType.RTA_Berth:
          response = PortcallTimestampType.PTA_Berth;
          break; 
        case PortcallTimestampType.ETC_Cargo_Ops:
          response = PortcallTimestampType.RTC_Cargo_Ops;
          break;
        case PortcallTimestampType.RTA_PBP:
          response = PortcallTimestampType.PTA_PBP;
          break;
        case PortcallTimestampType.RTD_Berth:
          response = PortcallTimestampType.PTD_Berth;
          break;

      }
    }
    
    // If I'm a terminal
    else if(role == PublisherRole.TR){
      switch (portCallTimestamp.timestampType) {

        case PortcallTimestampType.ETA_Berth:
          response = PortcallTimestampType.RTA_Berth;
          break;
        case PortcallTimestampType.RTC_Cargo_Ops:
          response = PortcallTimestampType.PTC_Cargo_Ops;
          break;
      }
    }

    // if I'm a (Experimental: Port Authorities) OR (Experimental: Port Pilot)
    else if(role === PublisherRole.PLT || role == PublisherRole.ATH) {
      switch (portCallTimestamp.timestampType){
        case PortcallTimestampType.ETA_PBP:
          response = PortcallTimestampType.RTA_PBP;
          break;
        case PortcallTimestampType.ETD_Berth:
          response = PortcallTimestampType.RTD_Berth;
          break;
      }
    }
    portCallTimestamp.response = response;
  }
}