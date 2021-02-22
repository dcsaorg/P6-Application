import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TransportEvent} from "../../../model/OVS/transport-event";
import {BACKEND_URL} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TransportEventService {
  private readonly TRANSPORT_EVENT_URL: string;
  constructor(private httpClient: HttpClient) {
    this.TRANSPORT_EVENT_URL = BACKEND_URL+"/transport-calls/transport-events"
  }

  getTransportEvents=(): Observable<TransportEvent[]> => this.httpClient.get<TransportEvent[]>(this.TRANSPORT_EVENT_URL);
}
