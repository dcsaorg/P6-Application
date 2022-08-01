import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { from, Observable } from "rxjs";
import { TransportCall } from "../../../model/jit/transport-call";
import { map, mergeMap, toArray, concatMap } from "rxjs/operators";
import { Timestamp } from 'src/app/model/jit/timestamp';
import { Globals } from 'src/app/model/portCall/globals';
import { PortService } from '../base/port.service';

@Injectable({
  providedIn: 'root'
})
export class TransportCallService {
  timestamps: Timestamp;
  private readonly TRANSPORT_CALL_URL: string;

  constructor(
    private httpClient: HttpClient,
    private globals: Globals,
    private portService: PortService
  ) {
    this.TRANSPORT_CALL_URL = globals.config.uiSupportBackendURL + "/unofficial/transport-calls"
  }

  getTransportCalls(unLocode?: string, vesselIMONumber?: string): Observable<TransportCall[]> {
    let httpParams = new HttpParams()
    if (unLocode != null) {
      httpParams = httpParams.set('UNLocationCode', unLocode)
    }
    if (vesselIMONumber) {
      httpParams = httpParams.set('vesselIMONumber', vesselIMONumber);
    }
    return this.httpClient.get<TransportCall[]>(this.TRANSPORT_CALL_URL, {
      params: httpParams
    }).pipe(
      mergeMap((transportCalls => {
        return from(transportCalls).pipe(
          map((transportCall) => {
            if (transportCall.UNLocationCode == null) {
              transportCall.UNLocationCode = transportCall.location?.UNLocationCode;
            }
            return transportCall;
          }),
          concatMap((transportCall) =>
            this.portService.getPortsByUNLocationCode(transportCall.UNLocationCode).pipe(map(port => {
              transportCall.portOfCall = port;
              return transportCall;
            }))
          ),
          toArray()
        )

      }))
    );
  }

  addTransportCall = (transportCall: TransportCall): Observable<TransportCall> =>
    this.httpClient.post<TransportCall>(this.TRANSPORT_CALL_URL, transportCall)

}
