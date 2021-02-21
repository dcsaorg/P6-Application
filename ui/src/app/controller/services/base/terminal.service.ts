import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../../environments/environment";
import {Terminal} from "../../../model/base/terminal";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TerminalService {
  private readonly TERMINAL_URL: string;

  constructor(private httpClient: HttpClient) {
    this.TERMINAL_URL = BACKEND_URL + '/terminals';
  }

  getTerminals = (): Observable<Terminal[]> => this.httpClient.get<Terminal[]>(this.TERMINAL_URL);
}
