import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Port } from "../../../model/portCall/port";
import { Globals } from "../../../model/portCall/globals";
import { Observable } from 'rxjs/internal/Observable';
import { map, shareReplay, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
  private ports$: Observable<Port[]>;



  constructor(private httpClient: HttpClient,
    private globals: Globals) {

    this.PORT_URL = globals.config.uiSupportBackendURL + '/unofficial/ports';
    this.PORT_URL_LIMIT_1000 = globals.config.uiSupportBackendURL + '/unofficial/ports' + '?limit=1000';
  }

  getPortByUNLocationCode(UNLocationCode: string): Observable<Port> {
    let query = '';
    if (UNLocationCode) {
      const cachedPort = this.unlocode2PortCache.get(UNLocationCode);
      if (cachedPort) {
        return of(cachedPort);
      }
      query = "?UNLocationCode=" + UNLocationCode;
    } else {
      throw new Error('UNLocationCode is not defined');
    }
    return this.httpClient.get<Port[]>(this.PORT_URL + query).pipe(
      map((ports) => {
        let port = ports[0];
        cachePort(this.unlocode2PortCache, port);
        return port;
      })
    );
  }

  getPorts(): Observable<Port[]> {
    if (!this.ports$) {
      this.ports$ = this.httpClient.get<Port[]>(this.PORT_URL_LIMIT_1000).pipe(
        tap(ports => {
          for (let port of ports) {
            cachePort(this.unlocode2PortCache, port);
          }
        }),
        shareReplay(1)
      ) as Observable<Port[]>;
    }
    return this.ports$;
  }
}
