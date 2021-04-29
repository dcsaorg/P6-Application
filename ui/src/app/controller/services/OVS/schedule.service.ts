import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {Schedule} from "../../../model/OVS/schedule";

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private readonly SCHEDULE_URL: string;
  constructor(private httpClient: HttpClient) {
    this.SCHEDULE_URL=BACKEND_URL+"/schedules"

  }

getSchedules=(): Observable<Schedule[]> => this.httpClient.get<Schedule[]>(this.SCHEDULE_URL);
}
