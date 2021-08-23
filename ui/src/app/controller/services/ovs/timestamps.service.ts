import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Timestamp} from "../../../model/ovs/timestamp";
import {BACKEND_URL} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TimestampService {
  private readonly TIMESTAMPS_URL: string;

  constructor(private httpClient: HttpClient) {
    this.TIMESTAMPS_URL = BACKEND_URL + "/timestamps";
  }

  addTimestamp = (timestamp: Timestamp): Observable<Timestamp> => {
    console.log("Fire Timestamp!");
    return this.httpClient.post<Timestamp>(this.TIMESTAMPS_URL, timestamp);
}
}
