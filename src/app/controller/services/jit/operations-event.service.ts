import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { OperationsEvent } from "../../../model/jit/operations-event";
import { Globals } from 'src/app/model/portCall/globals';
import { TimestampInfo } from 'src/app/model/jit/timestampInfo';

@Injectable({
  providedIn: 'root'
})
export class OperationsEventService {
  private readonly TIMESTAMPS_URL: string;
  private readonly OPERATIONS_EVENT_URL: string;
  private readonly EVENT_DELIVERY_STATUS_URL: string;
  private readonly LIMIT: string = '1000';

  constructor(private httpClient: HttpClient, globals: Globals) {
    this.TIMESTAMPS_URL = globals.config.jitBackendURL + "/timestamps";
    this.OPERATIONS_EVENT_URL = globals.config.jitBackendURL + "/events";
    this.EVENT_DELIVERY_STATUS_URL = globals.config.uiSupportBackendURL + "/unofficial/timestamp-info";
  }

  getTimestampInfoForTransportCall = (transportCallId: string, portCallPart?: string): Observable<TimestampInfo[]> => {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('limit', this.LIMIT);

    if (portCallPart) {
      httpParams = httpParams.set('portCallPart', portCallPart);
    }
    if (transportCallId) {
      httpParams = httpParams.set('transportCallID', transportCallId);
    }
    return this.httpClient.get<TimestampInfo[]>(this.EVENT_DELIVERY_STATUS_URL, {
      params: httpParams
    })
  }
}
