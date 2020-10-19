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

  addPortcallTimestamp = (portcalltimestamp: PortcallTimestamp, vesselId: number): Observable<PortcallTimestamp> => {
    const portcalltimestampToSend: PortcallTimestamp = {
      portNext: (portcalltimestamp.portNext as Port).id,
      portPrevious: (portcalltimestamp.portPrevious as Port).id,
      portOfCall: (portcalltimestamp.portOfCall as Port).id,
      terminal: (portcalltimestamp.terminal as Terminal).id,
      timestampType: portcalltimestamp.timestampType.replace('(-|\s)', '_'),
      locationId: portcalltimestamp.locationId,
      eventTypeCode: portcalltimestamp.eventTypeCode,
      direction: portcalltimestamp.direction,
      classifierCode: portcalltimestamp.classifierCode,
      eventTimestamp: portcalltimestamp.eventTimestamp,
      logOfTimestamp: portcalltimestamp.logOfTimestamp,
      delayCode: (portcalltimestamp.delayCode as DelayCode).id,
      changeComment: portcalltimestamp.changeComment
    }
    return this.httpClient.post<PortcallTimestamp>(this.TIMESTAMP_URL + "/" + vesselId, portcalltimestampToSend);
  }

  deleteTimestamp(timestampId: number) {
    console.log("Deleting port call timestamp with id " + timestampId);
    this.httpClient.delete(this.TIMESTAMP_URL + "/" + timestampId).subscribe(data => {
      console.log(data);
    });
  }
}
