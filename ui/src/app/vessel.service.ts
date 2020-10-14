import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {Vessel} from "./model/vessel";
import {BACKEND_URL} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class VesselService {

  constructor(private httpClient: HttpClient) {
  }

  getVessels = (): Observable<Vessel[]> => {
    return this.httpClient.get<Vessel[]>(BACKEND_URL + "/vessels");
  }
}
