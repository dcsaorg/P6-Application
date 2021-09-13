import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OperationsEvent} from "../../../model/ovs/operations-event";
import {BACKEND_URL} from "../../../../environments/environment";
import { TransportCall } from 'src/app/model/ovs/transport-call';
import { EventDelivery } from 'src/app/model/ovs/eventDelivery';

@Injectable({
  providedIn: 'root'
})
export class OperationsEventService {
  private readonly TIMESTAMPS_URL: string;
  private readonly TRANSPORT_CALL_URL: string;
  private readonly EVENT_DELIVERY_STATUS_URL: string;

  constructor(private httpClient: HttpClient) {
    this.TIMESTAMPS_URL = BACKEND_URL + "/timestamps";
    this.TRANSPORT_CALL_URL = BACKEND_URL + "/events";  
    this.EVENT_DELIVERY_STATUS_URL = BACKEND_URL + "/unofficial/event-delivery-status";
  }

  getEventDeliveryStatus = (eventID: string): Observable<EventDelivery> => this.httpClient.get<EventDelivery>(this.EVENT_DELIVERY_STATUS_URL + "/" + eventID)

  getOperationsEvents = (): Observable<OperationsEvent[]> => this.httpClient.get<OperationsEvent[]>(this.TIMESTAMPS_URL + "?eventType=OPERATIONS");

  getOperationsEventsByTransportCall = (transportCallId: string): Observable<OperationsEvent[]> => {
    const url = this.TRANSPORT_CALL_URL + "?eventType=OPERATIONS" + "&transportCallID=" + transportCallId ;
    return this.httpClient.get<OperationsEvent[]>(url);
  }

  addOperationsEvent = (operationsEvent: OperationsEvent): Observable<OperationsEvent> => {
    return this.httpClient.post<OperationsEvent>(this.TIMESTAMPS_URL, operationsEvent);
}
}
