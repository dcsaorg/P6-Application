import {Injectable} from '@angular/core';
import {PortcallTimestamp} from "../../../model/portCall/portcall-timestamp";
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {Port} from "../../../model/portCall/port";
import {Terminal} from "../../../model/portCall/terminal";
import {DelayCode} from "../../../model/portCall/delayCode";
import {Vessel} from "../../../model/portCall/vessel";
import {TimestampMappingService} from "../mapping/timestamp-mapping.service";
import {TransportCall} from "../../../model/OVS/transport-call";
import {PortcallTimestampType} from "../../../model/portCall/portcall-timestamp-type.enum";
import {map} from "rxjs/operators";
import {PartyFunction} from "../../../model/OVS/partyFunction";
import {Globals} from "../../../model/portCall/globals";
import {MessageDirection} from "../../../model/portCall/messageDirection";

@Injectable({
  providedIn: 'root'
})
export class PortcallTimestampService {
  private readonly TIMESTAMP_URL: string;


  constructor(private httpClient: HttpClient,
              private timestampMapping: TimestampMappingService,
              private globals: Globals) {
    this.TIMESTAMP_URL = BACKEND_URL + '/portcalltimestamps';
  }

  getPortcallTimestamps = (): Observable<PortcallTimestamp[]> => this.timestampMapping.getPortCallTimestamps();

  getPortcallTimestampsByTransportCall = (transportCall: TransportCall): Observable<PortcallTimestamp[]> =>
  this.timestampMapping.getPortCallTimestampsByTransportCall(transportCall).pipe(map( timestamp => this.postProcess(timestamp)))



  addPortcallTimestamp = (portcallTimestamp: PortcallTimestamp): Observable<PortcallTimestamp> => this.timestampMapping.addPortCallTimestamp(portcallTimestamp);
  //(portcallTimestamp: PortcallTimestamp): Observable<PortcallTimestamp> => this.httpClient.post<PortcallTimestamp>(this.TIMESTAMP_URL, PortcallTimestampService.convertPortcallTimestamp(portcallTimestamp));



  private static convertPortcallTimestamp(portcallTimestamp: PortcallTimestamp) {
    return {
      id: null,
      timestampType: portcallTimestamp.timestampType.replace('(-|\s)', '_'),
      vessel: portcallTimestamp.vessel = (portcallTimestamp.vessel as Vessel).id,
      callSequence: portcallTimestamp.callSequence,
      portNext: (portcallTimestamp.portNext as Port).id,
      portPrevious: (portcallTimestamp.portPrevious as Port).id,
      portOfCall: (portcallTimestamp.portOfCall as Port).id,
      terminal: (portcallTimestamp.terminal as Terminal).id,
      locationId: portcallTimestamp.locationId,
      eventTypeCode: portcallTimestamp.eventTypeCode,
      direction: portcallTimestamp.direction,
      classifierCode: portcallTimestamp.classifierCode,
      eventTimestamp: portcallTimestamp.eventTimestamp,
      logOfTimestamp: portcallTimestamp.logOfTimestamp,
      delayCode: (portcallTimestamp.delayCode == null ? null : (portcallTimestamp.delayCode as DelayCode).id),
      changeComment: (portcallTimestamp.changeComment != null ? (portcallTimestamp.changeComment.length > 0 ? portcallTimestamp.changeComment : null) : null)
    };
  }


  /**
   *
   * This function will process the timestamps and add some additional information as of their order!
   *
   */
  private postProcess(timestmaps: PortcallTimestamp[]): PortcallTimestamp[]{

    let portaproaches = new Map<string,number>();
    for (let timestamp of timestmaps){
      this.setMessageDirection(timestamp);

      let hash:string = this.getPortCallTimestampHash(timestamp);
      let count:number;
      count = (portaproaches.get(hash)?portaproaches.get(hash)+1:1);
      portaproaches.set(hash, 0);
    }
    this.markTimestampsOutdated(portaproaches, timestmaps);
    return timestmaps

  }


  /**
   * Function that will retrive the last timestamp of an aproach an mark all others as outdated
   * @toDo Refactor!
   */
    private markTimestampsOutdated(portaproaches: Map<string, number>, timestamps: PortcallTimestamp[]){
      for (let approach of portaproaches.keys()){
        let latest:PortcallTimestamp = null;
        for (let timestamp of timestamps){
          let hash:string = this.getPortCallTimestampHash(timestamp)
          if(hash == approach){
            if(latest == null){
              latest = timestamp;
              if(portaproaches.get(hash) > 1){
                timestamp.outdatedMessage = true;
              }
            } else if(latest.logOfTimestamp <= timestamp.logOfTimestamp){
              latest.outdatedMessage = true;
              latest = timestamp;
            }
          }
        }
      }
  }


  /**
   * Method that will define the messaging direction based on publisherID and PublisherRole
   *
   **/

  private setMessageDirection(portcallTimestamp: PortcallTimestamp){
    if(portcallTimestamp.publisherRole == this.globals.config.publisherRole
      && portcallTimestamp.publisher == this.globals.config.publisher) {
      portcallTimestamp.messageDirection = MessageDirection.outbound;
    } else {
      portcallTimestamp.messageDirection = MessageDirection.outbound;
    }
  }

  /**
   * Method to calculate a sequence for timestamps:
   * A sequence always starts with an Estimated Classifier code (EST) and ends with an ACTUAL (ACT
   * a sequence is always based on the vessel, the location, and the port and terminals of timestamp
   */
  private calculateCallSequence(portcallTimestamps: PortcallTimestamp[]){
    portcallTimestamps.forEach(function (timestamp){

    })
  }




  private getPortCallTimestampHash(timestamp: PortcallTimestamp): string{
    return timestamp.transportCallID+timestamp.locationType + timestamp.eventTypeCode;
  }

  /**
   *
   * Identifying who can accept a timestamp and which timestamp type would be the response on this timestamp.
   *
   */
  public setResponseType(portCallTimestamp: PortcallTimestamp, role: PartyFunction) {
    let response: PortcallTimestampType = null;

    // If I'm a carrier
    if (role == PartyFunction.CA) {
      switch (portCallTimestamp.timestampType) {
        case PortcallTimestampType.RTA_Berth:
          response = PortcallTimestampType.PTA_Berth;
          break;
        case PortcallTimestampType.RTA_PBP:
          response = PortcallTimestampType.PTA_PBP;
          break;
        case PortcallTimestampType.ETC_Cargo_Ops:
          response = PortcallTimestampType.RTC_Cargo_Ops;
          break;
        case PortcallTimestampType.RTD_Berth:
          response = PortcallTimestampType.PTD_Berth
      }
    }
    // If I'm a terminal
    else if(role = PartyFunction.TR){
      switch (portCallTimestamp.timestampType){
        case PortcallTimestampType.ETA_Berth:
          response = PortcallTimestampType.RTA_Berth;
          break;
        case PortcallTimestampType.RTC_Cargo_Ops:
          response = PortcallTimestampType.PTC_Cargo_Ops;
          break;
      }
    }
    // if I'm a port
    else if(role = PartyFunction.POR){
      switch (portCallTimestamp.timestampType){
        case PortcallTimestampType.ETA_PBP:
          response= PortcallTimestampType.RTA_PBP;
          break;
        case PortcallTimestampType.ETD_Berth:
          response= PortcallTimestampType.RTD_Berth;
          break;
      }
    }
    portCallTimestamp.response = response;
  }
}
