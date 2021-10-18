import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Port} from "../../../model/portCall/port";
import {Globals} from "../../../model/portCall/globals";
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PortService {
  private readonly PORT_URL: string;
  private readonly PORT_URL_LIMIT_1000: string;
  

  constructor(private httpClient: HttpClient,
              private globals: Globals) {
                
    this.PORT_URL = globals.config.uiSupportBackendURL + '/unofficial/ports' ;
    this.PORT_URL_LIMIT_1000 = globals.config.uiSupportBackendURL + '/unofficial/ports' + '?limit=1000';
  }

  getPortsByUNLocationCode = (unLocationCode?: string): Observable<Port[]> => this.httpClient.get<Port[]>(this.PORT_URL + "?unLocationCode=" + unLocationCode);
  getPorts = (): Observable<Port[]> => this.httpClient.get<Port[]>(this.PORT_URL_LIMIT_1000);


}
