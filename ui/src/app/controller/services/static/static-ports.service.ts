import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Port} from "../../../model/base/port";
import {HttpClient} from "@angular/common/http";
import {BACKEND_URL} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StaticPortsService {
  private readonly PORT_FILE: string;

  constructor(private httpClient: HttpClient) {
    //this.PORT_FILE = BACKEND_URL + '/ports';
    this.PORT_FILE = "/assets/static_data/ports.json";
  }


getPorts = (): Observable<Port[]> => this.httpClient.get<Port[]>(this.PORT_FILE);
}
