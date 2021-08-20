import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OperationsEvent} from "../../../model/OVS/operations-event";
import {BACKEND_URL} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OperationsEventService {
  private readonly TIMESTAMPS_URL: string;
  private readonly TRANSPORT_CALL_URL: string;

  constructor(private httpClient: HttpClient) {
    this.TIMESTAMPS_URL = BACKEND_URL + "/timestamps";
    this.TRANSPORT_CALL_URL = BACKEND_URL + "/events"
  }

  getOperationsEvents = (): Observable<OperationsEvent[]> => this.httpClient.get<OperationsEvent[]>(this.TIMESTAMPS_URL);

  getOperationsEventsByTransportCall = (transportCallId: string): Observable<OperationsEvent[]> => {
    const url = this.TRANSPORT_CALL_URL //+ "?transportCallID=" + transportCallId ;
    return this.httpClient.get<OperationsEvent[]>(url);
  }

  addOperationsEvent = (operationsEvent: OperationsEvent): Observable<OperationsEvent> => {
    console.log("Fire!");
    return this.httpClient.post<OperationsEvent>(this.TIMESTAMPS_URL, operationsEvent);
    //
}
}
