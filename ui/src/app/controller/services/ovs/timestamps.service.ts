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
        case PortcallTimestampType.ETS_Bunkering:
          response = PortcallTimestampType.RTS_Bunkering;
          break
        case PortcallTimestampType.ETC_Bunkering:
          response = PortcallTimestampType.RTC_Bunkering;
          break
        case PortcallTimestampType.ETS_Cargo_Ops:
          response = PortcallTimestampType.RTS_Cargo_Ops;
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
        case PortcallTimestampType.RTS_Cargo_Ops:
          response = PortcallTimestampType.PTS_Cargo_Ops
          break  
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

    // if i am a Bunkering service provider
    else if(role === PublisherRole.BUK) {
      switch (portCallTimestamp.timestampType){
        case PortcallTimestampType.RTS_Bunkering:
          response = PortcallTimestampType.PTS_Bunkering;
          break;
        case PortcallTimestampType.RTC_Bunkering:
          response = PortcallTimestampType.PTC_Bunkering
          break
      }
    }

    // if i am a towage service provider
    else if(role === PublisherRole.TWG) {
      switch (portCallTimestamp.timestampType){
        case PortcallTimestampType.RTS_Towage:
          response = PortcallTimestampType.PTS_Towage
          break
      }
    }

    // if i am a lashing service provider
    else if(role === PublisherRole.LSH) {
      switch (portCallTimestamp.timestampType){
      }
    }
  }


  // declaring primary timestamp

  public isPrimary(portCallTimestamp: Timestamp, role: PublisherRole): boolean {
    // If I'm a carrier
 if (role === PublisherRole.CA || role === PublisherRole.AG || role === PublisherRole.VSL  ) {
   switch (portCallTimestamp.timestampType) {

    case PortcallTimestampType.RTA_Berth:
    case PortcallTimestampType.ETC_Cargo_Ops:
    case PortcallTimestampType.PTC_Cargo_Ops:
    case PortcallTimestampType.ATS_Cargo_Ops:
    case PortcallTimestampType.PTS_Cargo_Ops:
    case PortcallTimestampType.PTC_Bunkering:
    case PortcallTimestampType.PTS_Bunkering:  
    case PortcallTimestampType.RTA_PBP:
    case PortcallTimestampType.RTD_Berth:
    case PortcallTimestampType.ETS_Bunkering:
    case PortcallTimestampType.ETC_Bunkering:
    case PortcallTimestampType.ETS_Cargo_Ops:
    case PortcallTimestampType.ATS_Bunkering:
    case PortcallTimestampType.ATC_Bunkering:
    case PortcallTimestampType.ATC_Cargo_Ops:  
    case PortcallTimestampType.ATC_Lashing:
    case PortcallTimestampType.Terminal_Ready_for_Vessel_Departure:

    return true
       
   }
 }
 
 // If I'm a terminal
 else if(role == PublisherRole.TR){
   switch (portCallTimestamp.timestampType) {
     
    case PortcallTimestampType.ETA_Berth:
    case PortcallTimestampType.RTC_Cargo_Ops:
    case PortcallTimestampType.RTS_Cargo_Ops:
    case PortcallTimestampType.PTA_Berth:
    case PortcallTimestampType.Vessel_Readiness_for_Cargo_Ops:
          
    return true
 }
}

 // if I'm a (Experimental: Port Authorities) OR (Experimental: Port Pilot)
 else if(role === PublisherRole.PLT || role == PublisherRole.ATH) {
   switch (portCallTimestamp.timestampType){
   
    case PortcallTimestampType.ETA_PBP:
    case PortcallTimestampType.ETD_Berth:
    case PortcallTimestampType.PTD_Berth:
    case PortcallTimestampType.ATD_Berth:
    case PortcallTimestampType.ATC_Pilotage:
    case PortcallTimestampType.SOSP:
    case PortcallTimestampType.ATA_Berth:
    case PortcallTimestampType.EOSP:
    case PortcallTimestampType.Gangway_Down_and_Safe:
    case PortcallTimestampType.AT_All_Fast:
    case PortcallTimestampType.ATC_Towage:
    case PortcallTimestampType.ATS_Towage:
    case PortcallTimestampType.ATS_Pilotage:
    case PortcallTimestampType.ATA_PBP:
    case PortcallTimestampType.PTA_PBP:
    case PortcallTimestampType.PTS_Towage:
    case PortcallTimestampType.PTS_Pilotage:
    case PortcallTimestampType.RTS_Pilotage:

    return true
   }
 } 

 // if i am a Bunkering service provider
 else if(role === PublisherRole.BUK) {
  switch (portCallTimestamp.timestampType){

    case PortcallTimestampType.RTS_Bunkering:
    case PortcallTimestampType.RTC_Bunkering:
    
    return true
  }
}

// if i am a towage service provider
else if(role === PublisherRole.TWG) {
  switch (portCallTimestamp.timestampType){

    case PortcallTimestampType.RTS_Towage:

    return true
  }
}

// if i am a lashing service provider
else if(role === PublisherRole.LSH) {
  switch (portCallTimestamp.timestampType){
  }
}
 return false
}




}