import {Injectable} from '@angular/core';
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../environments/environment";
import {Observable} from "rxjs";
import {Port} from "../model/port";
import {Terminal} from "../model/terminal";
import {DelayCode} from "../model/delayCode";

@Injectable({
  providedIn: 'root'
})
export class PortcallTimestampService {
  private TIMESTAMP_URL: string;


  constructor(private httpClient: HttpClient) {
    this.TIMESTAMP_URL = BACKEND_URL + '/portcalltimestamps';
  }

  getPortcallTimestamps = (vesselId: number): Observable<PortcallTimestamp[]> => {
    return this.httpClient.get<PortcallTimestamp[]>(this.TIMESTAMP_URL + "/" + vesselId);
  }

  getHighesTimestampId = (vesselId: number): Observable<number> => {
    return this.httpClient.get<number>(this.TIMESTAMP_URL + "/highestTimestampId/" + vesselId);
  }

  addPortcallTimestamp = (portcallTimestamp: PortcallTimestamp, vesselId: number): Observable<PortcallTimestamp> => {
    return this.httpClient.post<PortcallTimestamp>(this.TIMESTAMP_URL + "/" + vesselId, this.getPortcalltimestampToSend(portcallTimestamp));
  }


  updatePortcallTimestampDelayCodeAndComment = (portcallTimestamp: PortcallTimestamp): Observable<Object> => {
    console.log("Updating port call timestamp with id " + portcallTimestamp.id);
    return this.httpClient.put(this.TIMESTAMP_URL + '/' + portcallTimestamp.id, this.getPortcalltimestampToSend(portcallTimestamp));
  };

  deleteTimestamp = (timestampId: number): Observable<any> => {
    console.log("Deleting port call timestamp with id " + timestampId);
    return this.httpClient.delete<any>(this.TIMESTAMP_URL + "/" + timestampId);
  }


  private getPortcalltimestampToSend(portcallTimestamp: PortcallTimestamp) {
    return {
      id: null,
      timestampType: portcallTimestamp.timestampType.replace('(-|\s)', '_'),
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
}
