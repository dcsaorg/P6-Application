import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TransportEvent} from "../../../model/OVS/transport-event";
import {BACKEND_URL} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TransportEventService {
  private readonly TRANSPORT_EVENT_URL: string;
  private readonly TRANSPORT_CALL_URL: string;

  constructor(private httpClient: HttpClient) {
    this.TRANSPORT_EVENT_URL = BACKEND_URL + "/transport-calls/transport-events";
    this.TRANSPORT_CALL_URL = BACKEND_URL + "/transport-calls"
  }

  getTransportEvents = (): Observable<TransportEvent[]> => this.httpClient.get<TransportEvent[]>(this.TRANSPORT_EVENT_URL);

  getTransportEventsByTransportCall = (transportCallId: string): Observable<TransportEvent[]> => {
    const url = this.TRANSPORT_CALL_URL + "/" + transportCallId + "/transport-events";
    return this.httpClient.get<TransportEvent[]>(url);
  }

  addTransportEvent = (transportEvent: TransportEvent): Observable<TransportEvent> => {
    console.log(transportEvent);
    return this.httpClient.post<TransportEvent>(this.TRANSPORT_EVENT_URL, transportEvent);
  }
}
