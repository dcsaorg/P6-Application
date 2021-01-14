import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../environments/environment";
import {Port} from "../../model/port";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PortService {
  private readonly PORT_URL: string;

  constructor(private httpClient: HttpClient) {
    this.PORT_URL = BACKEND_URL + '/ports';
  }

  getPorts = (): Observable<Port[]> => this.httpClient.get<Port[]>(this.PORT_URL);
}
