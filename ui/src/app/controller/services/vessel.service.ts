import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {Vessel} from "../../model/vessel";
import {BACKEND_URL} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class VesselService {
  private readonly VESSEL_URL: string;

  constructor(private httpClient: HttpClient) {
    this.VESSEL_URL = BACKEND_URL + '/vessels';
  }

  getVessels = (): Observable<Vessel[]> => this.httpClient.get<Vessel[]>(this.VESSEL_URL);

  getVessel = (vesselId: number): Observable<Vessel> => this.httpClient.get<Vessel>(this.VESSEL_URL + '/' + vesselId);

  updateVessel = (vessel: Vessel): Observable<Object> => this.httpClient.put(this.VESSEL_URL + '/' + vessel.id, vessel);

  addVessel = (vessel: Vessel): Observable<Vessel> => this.httpClient.post<Vessel>(this.VESSEL_URL, vessel);
}
