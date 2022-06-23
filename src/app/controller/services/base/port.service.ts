import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Port} from "../../../model/portCall/port";
import {Globals} from "../../../model/portCall/globals";
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import {of} from 'rxjs';

function cachePort(cache: Map<string, Port>, port: Port) {
  cache.set(port.UNLocationCode, port);
}

@Injectable({
  providedIn: 'root'
})
export class PortService {
  private readonly PORT_URL: string;
  private readonly PORT_URL_LIMIT_1000: string;
  private unlocode2PortCache = new Map<string, Port>();


  constructor(private httpClient: HttpClient,
              private globals: Globals) {

    this.PORT_URL = globals.config.uiSupportBackendURL + '/unofficial/ports' ;
    this.PORT_URL_LIMIT_1000 = globals.config.uiSupportBackendURL + '/unofficial/ports' + '?limit=1000';
  }

  getPortsByUNLocationCode(UNLocationCode?: string): Observable<Port> {
    let query = '';
    if (UNLocationCode) {
      const cachedPort = this.unlocode2PortCache.get(UNLocationCode);
      if (cachedPort) {
        return of(cachedPort);
      }
      query = "?UNLocationCode=" + UNLocationCode;
    }
    return this.httpClient.get<Port[]>(this.PORT_URL + query).pipe(
      map((ports) => {
        let port = ports[0];
        cachePort(this.unlocode2PortCache, port);
        return port;
      })
    );
  }
  getPorts = (): Observable<Port[]> => this.httpClient.get<Port[]>(this.PORT_URL_LIMIT_1000)
    .pipe(map(ports => {
      for (let port of ports) {
        cachePort(this.unlocode2PortCache, port);
      }
      return ports;
    }));


}
