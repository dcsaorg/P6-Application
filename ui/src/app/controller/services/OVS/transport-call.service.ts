import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {TransportCall} from "../../../model/OVS/transport-call";

@Injectable({
  providedIn: 'root'
})
export class TransportCallService {

  private readonly TRANSPORT_CALL_URL: string;

  constructor(private httpClient: HttpClient) {
    this.TRANSPORT_CALL_URL=BACKEND_URL+"/transport-calls"
  }

  getTransportCalls = (): Observable<TransportCall[]> => this.httpClient.get<TransportCall[]>(this.TRANSPORT_CALL_URL);
}
