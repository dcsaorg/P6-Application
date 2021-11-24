import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {from, Observable} from "rxjs";
import {TransportCall} from "../../../model/jit/transport-call";
import {map, mergeMap, toArray, concatMap} from "rxjs/operators";
import {Timestamp} from 'src/app/model/jit/timestamp';
import { Globals } from 'src/app/model/portCall/globals';
import { PortService } from '../base/port.service';

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
    private portSevice: PortService
  ) {
    this.TRANSPORT_CALL_URL = globals.config.uiSupportBackendURL + "/unofficial/transport-calls"
    this.OPERATIONS_EVENT_URL = globals.config.jitBackendURL + "/events?eventType=OPERATIONS&sort=eventCreatedDateTime:DESC&limit=1"
  }

  getTransportCalls(unLocode? : string, smdgCode? : string, vesselIMONumber? : string): Observable<TransportCall[]> {
    let httpParams = new HttpParams()
    if(unLocode != null) {
      httpParams = httpParams.set('facility.UNLocationCode', unLocode)
      if(smdgCode != null) {
        httpParams = httpParams.set('facility.facilitySMGDCode', smdgCode)
      }
    }
    if (vesselIMONumber) {
      httpParams = httpParams.set('vessel.vesselIMONumber', vesselIMONumber);
    } else {
      httpParams = httpParams.set('vessel.vesselIMONumber:neq', 'NULL');
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
            return transportCall;
          }),
          concatMap((transportCall) =>
            this.portSevice.getPortsByUNLocationCode(transportCall.UNLocationCode).pipe(map(port => {
              transportCall.portOfCall = port;
              return transportCall;
            }))
          ),
          toArray()
        )

      }))
    );
  }

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
