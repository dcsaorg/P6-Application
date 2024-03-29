import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
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

  getTimestampInfoForTransportCall = (portVisitID: string, facilitySMDGCode: string|null, negotiationCycleKey?: string, portCallPart?: string): Observable<TimestampInfo[]> => {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('limit', this.LIMIT);

    if (portCallPart) {
      httpParams = httpParams.set('portCallPart', portCallPart);
    }
    if (portVisitID) {
      httpParams = httpParams.set('portVisitID', portVisitID);
    }
    if (facilitySMDGCode) {
      httpParams = httpParams.set('facilitySMDGCode', facilitySMDGCode);
    }
    if (negotiationCycleKey) {
      httpParams = httpParams.set('negotiationCycle', negotiationCycleKey);
    }
    return this.httpClient.get<TimestampInfo[]>(this.TIMESTAMP_INFO_URL, {
      params: httpParams
    })
  }
}
