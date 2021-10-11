import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {from, Observable} from "rxjs";
import {TransportCall} from "../../../model/ovs/transport-call";
import {map, mergeMap, toArray, concatMap} from "rxjs/operators";
import {Timestamp} from 'src/app/model/ovs/timestamp';
import { Port } from 'src/app/model/portCall/port';
import { Globals } from 'src/app/model/portCall/globals';

@Injectable({
  providedIn: 'root'
})
export class TransportCallService {
  timestamps: Timestamp;
  private readonly TRANSPORT_CALL_URL: string;
  private readonly OPERATIONS_EVENT_URL: string;

  constructor(
    private httpClient: HttpClient,
    private globals: Globals,
  ) {
    this.TRANSPORT_CALL_URL = globals.config.uiSupportBackendURL + "/unofficial/transport-calls"
    this.OPERATIONS_EVENT_URL = globals.config.ovsBackendURL + "/events?eventType=OPERATIONS&sort=eventCreatedDateTime:DESC&limit=1"
  }


  private getPortByUnLocode(unlocode: string): Port {
    for (let port of this.globals.ports) {
      if (port.unLocode == unlocode) {
        return port;
      }
    }
    return null;
  }

  getTransportCalls(unLocode? : string, smdgCode? : string ): Observable<TransportCall[]> {
    let httpParams = new HttpParams()
    if(unLocode != null) {
      httpParams = httpParams.set('facility.UNLocationCode', unLocode)
      if(smdgCode != null) {
        httpParams = httpParams.set('facility.facilitySMGDCode', smdgCode)
      }
    }
    return this.httpClient.get<TransportCall[]>(this.TRANSPORT_CALL_URL, {
     params: httpParams
    }).pipe(
      mergeMap((transportCalls => {
        return from(transportCalls).pipe(
          map(this.extractVesselAttributes),
          map((transportCall) => {
            if (transportCall.UNLocationCode == null) {
                transportCall.UNLocationCode = transportCall.location?.UNLocationCode;
            }
            transportCall.portOfCall = this.getPortByUnLocode(transportCall.UNLocationCode)
            return transportCall;
          }),
          concatMap((transportCall) =>
            this.getLatestETABerthTimestamp(transportCall.transportCallID).pipe(map(timestamps => {
              if (timestamps.length > 0) {
                let timestamp = timestamps[0]
                transportCall.estimatedDateofArrival = timestamp['eventDateTime'];
              }
              return transportCall;
            }))
          ),
          toArray()
        )

      }))
    );
  }

  getLatestETABerthTimestamp = (transportCallId: string): Observable<Timestamp[]> =>
  this.httpClient.get<Timestamp[]>(this.OPERATIONS_EVENT_URL + "&eventClassifierCode=EST&operationsEventTypeCode=ARRI&facilityTypeCode=BRTH&transportCallID=" + transportCallId).pipe(map(transportCalls => (transportCalls)));

  getTransportCallsById = (transportCallId: string): Observable<TransportCall> => this.httpClient.get<TransportCall>(this.TRANSPORT_CALL_URL + "/" + transportCallId);

  addTransportCall = (transportCall: TransportCall): Observable<TransportCall> =>
    this.httpClient.post<TransportCall>(this.TRANSPORT_CALL_URL, transportCall)


  private extractVesselAttributes(transportCall: TransportCall) {
    if (transportCall['vessel'] === null) {
      transportCall.vesselName = null;
      transportCall.vesselIMONumber = null;
    } else {
      transportCall.vesselName = transportCall['vessel']['vesselName'];
      transportCall.vesselIMONumber = transportCall['vessel']['vesselIMONumber'];
    }
    return transportCall
  }
}
