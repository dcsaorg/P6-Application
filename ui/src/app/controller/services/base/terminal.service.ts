import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Terminal} from "../../../model/portCall/terminal";
import {Observable} from "rxjs";
import {Globals} from "../../../model/portCall/globals";

@Injectable({
  providedIn: 'root'
})
export class TerminalService {
  private readonly TERMINAL_URL_BACKEND: string;

  constructor(private httpClient: HttpClient,
              private globals: Globals) {
    this.TERMINAL_URL_BACKEND = globals.config.uiSupportBackendURL + '/unofficial/terminals?facilitySMDGCode:neq=NULL';
  }

  getTerminalsByUNLocationCode = (unLocationCode?: string): Observable<Terminal[]> =>
    this.httpClient.get<Terminal[]>(this.TERMINAL_URL_BACKEND + "&UNLocationCode=" + unLocationCode);

}
