import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { OperationsEvent } from "../../../model/jit/operations-event";
import { Globals } from 'src/app/model/portCall/globals';
import { TimestampInfo } from 'src/app/model/jit/timestamp-info';

@Injectable({
  providedIn: 'root'
})
export class TimestampInfoService {
  private readonly TIMESTAMP_INFO_URL: string;
  private readonly LIMIT: string = '1000';

  constructor(private httpClient: HttpClient, globals: Globals) {
    this.TIMESTAMP_INFO_URL = globals.config.uiSupportBackendURL + "/unofficial/timestamp-info";
  }

  getTimestampInfoForTransportCall = (portVisitID: string, portCallPart?: string): Observable<TimestampInfo[]> => {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('limit', this.LIMIT);

    if (portCallPart) {
      httpParams = httpParams.set('portCallPart', portCallPart);
    }
    if (portVisitID) {
      httpParams = httpParams.set('portVisitID', portVisitID);
    }
    return this.httpClient.get<TimestampInfo[]>(this.TIMESTAMP_INFO_URL, {
      params: httpParams
    })
  }
}
