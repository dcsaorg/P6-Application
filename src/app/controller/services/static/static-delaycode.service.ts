import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {DelayCode} from "../../../model/portCall/delayCode";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StaticDelaycodeService {
  private readonly DELAY_CODE_FILE: string;

  constructor(private httpClient: HttpClient) {
    this.DELAY_CODE_FILE = '/assets/static_data/delaycodes.json';
  }

  getDelayCodes = (): Observable<DelayCode[]> => this.httpClient.get<DelayCode[]>(this.DELAY_CODE_FILE);
}
