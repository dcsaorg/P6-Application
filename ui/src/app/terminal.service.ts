import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../environments/environment";
import {Observable} from "rxjs";
import {Terminal} from "./model/terminal";

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  private TERMINAL_URL: string;

  constructor(private httpClient: HttpClient) {
    this.TERMINAL_URL = BACKEND_URL + '/terminals';
  }

  getTerminals = (portId: number): Observable<Terminal[]> => {
    return this.httpClient.get<Terminal[]>(this.TERMINAL_URL + '/' + portId);
  }
}
