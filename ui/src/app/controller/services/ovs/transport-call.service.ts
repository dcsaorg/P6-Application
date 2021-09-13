import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../../environments/environment";
import {from, Observable} from "rxjs";
import {TransportCall} from "../../../model/ovs/transport-call";
import {map, mergeMap, toArray, concatMap} from "rxjs/operators";
import {Timestamp} from 'src/app/model/ovs/timestamp';

@Injectable({
  providedIn: 'root'
})
export class TransportCallService {
  timestamps: Timestamp;
  private readonly TRANSPORT_CALL_URL: string;
  private readonly OPERATIONS_EVENT_URL: string;

  constructor(private httpClient: HttpClient) {
    this.TRANSPORT_CALL_URL = BACKEND_URL + "/unofficial/transport-calls"
    this.OPERATIONS_EVENT_URL = BACKEND_URL + "/events?eventType=OPERATIONS&sort=eventCreatedDateTime:DESC&limit=1"
  }

  getTransportCalls = (): Observable<TransportCall[]> =>
    this.httpClient.get<TransportCall[]>(this.TRANSPORT_CALL_URL).pipe(
      mergeMap((transportCalls => {
        return from(transportCalls).pipe(
          map(this.extractVesselAttributes),
          concatMap((transportCall) =>
            this.getOperationsEventstoTimestamp(transportCall.transportCallID).pipe(map(timestamps => {
              if (timestamps.length > 0) {
                let timestamp = timestamps[0]
                transportCall.estimatedDateofArrival = timestamp['eventDateTime'];
              } else {
                transportCall.estimatedDateofArrival = 'N/A';
              }
              return transportCall;
            }))
          ),
          toArray()
        )

      }))
    );

  getOperationsEventstoTimestamp = (transportCallId: string): Observable<Timestamp[]> =>
    this.httpClient.get<Timestamp[]>(this.OPERATIONS_EVENT_URL + "&transportCallID=" + transportCallId).pipe(map(transportCalls => (transportCalls)));

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
