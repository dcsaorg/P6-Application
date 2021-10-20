import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OperationsEvent} from "../../../model/ovs/operations-event";
import {Globals} from 'src/app/model/portCall/globals';
import { EventDelivery } from 'src/app/model/ovs/eventDelivery';

@Injectable({
  providedIn: 'root'
})
export class OperationsEventService {
  private readonly TIMESTAMPS_URL: string;
  private readonly OPERATIONS_EVENT_URL: string;
  private readonly EVENT_DELIVERY_STATUS_URL: string;

  constructor(private httpClient: HttpClient, globals: Globals) {
    this.TIMESTAMPS_URL = globals.config.ovsBackendURL + "/timestamps";
    this.OPERATIONS_EVENT_URL = globals.config.ovsBackendURL + "/events";
    this.EVENT_DELIVERY_STATUS_URL = globals.config.uiSupportBackendURL + "/unofficial/event-delivery-status";
  }

  getEventDeliveryStatus = (eventID: string): Observable<EventDelivery> => this.httpClient.get<EventDelivery>(this.EVENT_DELIVERY_STATUS_URL + "/" + eventID)

  getOperationsEventsByTransportCall = (transportCallId: string): Observable<OperationsEvent[]> => {
    const url = this.OPERATIONS_EVENT_URL + "?eventType=OPERATIONS" + "&transportCallID=" + transportCallId + '&sort=eventCreatedDateTime:DESC&limit=1000' ;
    return this.httpClient.get<OperationsEvent[]>(url);
  }

  addOperationsEvent = (operationsEvent: OperationsEvent): Observable<OperationsEvent> => {
    return this.httpClient.post<OperationsEvent>(this.TIMESTAMPS_URL, operationsEvent);
}
}
