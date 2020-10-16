import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../environments/environment";
import {Observable} from "rxjs";
import {Port} from "../model/port";

@Injectable({
  providedIn: 'root'
})
export class PortService {

  private PORT_URL: string;

  constructor(private httpClient: HttpClient) {
    this.PORT_URL = BACKEND_URL + '/ports';
  }

  getPorts = (): Observable<Port[]> => {
    return this.httpClient.get<Port[]>(this.PORT_URL);
  }
}
