import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Timestamp} from "../../../model/jit/timestamp";
import {Globals} from "../../../model/portCall/globals";

@Injectable({
  providedIn: 'root'
})
export class TimestampService {
  private readonly TIMESTAMPS_URL: string;
  constructor(private httpClient: HttpClient, globals: Globals) {
    this.TIMESTAMPS_URL = globals.config.jitBackendURL + "/timestamps";
  }

  addTimestamp = (timestamp: Timestamp): Observable<Timestamp> => {
    return this.httpClient.post<Timestamp>(this.TIMESTAMPS_URL, timestamp);
  }

}
