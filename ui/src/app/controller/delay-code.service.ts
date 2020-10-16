import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../environments/environment";
import {Observable} from "rxjs";
import {DelayCode} from "../model/delayCode";

@Injectable({
  providedIn: 'root'
})
export class DelayCodeService {

  private DELAY_CODE_URL: string;

  constructor(private httpClient: HttpClient) {

    this.DELAY_CODE_URL = BACKEND_URL + '/delaycodes';

  }

  getAllDelayCodes = (): Observable<DelayCode[]> => {
    return this.httpClient.get<DelayCode[]>(this.DELAY_CODE_URL);
  }

}
