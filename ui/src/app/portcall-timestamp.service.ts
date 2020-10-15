import {Injectable} from '@angular/core';
import {PortcallTimestamp} from "./model/portcall-timestamp";
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../environments/environment";
import {Observable} from "rxjs";
import {Port} from "./model/port";

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

  addPortcallTimestamp =(portcalltimestamp: PortcallTimestamp, vesselId: number) :Observable<PortcallTimestamp> => {
    return this.httpClient.post<PortcallTimestamp>(this.TIMESTAMP_URL+ "/"+vesselId, portcalltimestamp);
  }
}
