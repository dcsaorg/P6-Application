import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OperationsEvent} from "../../../model/OVS/operations-event";
import {BACKEND_URL} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OperationsEventService {
  private readonly OPERATIONS_EVENT_URL: string;
  private readonly TRANSPORT_CALL_URL: string;

  constructor(private httpClient: HttpClient) {
    this.OPERATIONS_EVENT_URL = BACKEND_URL + "/transport-calls/operations-events";
    this.TRANSPORT_CALL_URL = BACKEND_URL + "/transport-calls"
  }

  getTransportEvents = (): Observable<OperationsEvent[]> => this.httpClient.get<OperationsEvent[]>(this.OPERATIONS_EVENT_URL);

  getTransportEventsByTransportCall = (transportCallId: string): Observable<OperationsEvent[]> => {
    const url = this.TRANSPORT_CALL_URL + "/" + transportCallId + "/operations-events";
    return this.httpClient.get<OperationsEvent[]>(url);
  }

  addTransportEvent = (transportEvent: OperationsEvent): Observable<OperationsEvent> => {
    console.log("Fire!");
    return this.httpClient.post<OperationsEvent>(this.OPERATIONS_EVENT_URL, transportEvent);
    //
}
}
