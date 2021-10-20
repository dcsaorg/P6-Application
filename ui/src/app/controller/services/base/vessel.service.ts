import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, ReplaySubject} from "rxjs";
import {map} from "rxjs/operators";

import {Vessel} from "../../../model/portCall/vessel";
import {Carrier} from "../../../model/portCall/carrier";
import {Globals} from "../../../model/portCall/globals";

@Injectable({
  providedIn: 'root'
})
export class VesselService {
  private vesselsDataSource = new ReplaySubject<null>()
  vesselsObservable = this.vesselsDataSource.asObservable()

  private readonly VESSEL_URL: string;
  private readonly CARRIER_URL: string;

  constructor(private httpClient: HttpClient, globals: Globals) {
    this.VESSEL_URL = globals.config.uiSupportBackendURL + '/unofficial/vessels';
    this.CARRIER_URL = globals.config.uiSupportBackendURL + '/unofficial/carriers';
  }

  getVessels = (): Observable<Vessel[]> =>  this.httpClient.get<Vessel[]>(this.VESSEL_URL + '?limit=1000'); //this.vesselMappingService.getVessels();

  getVessel = (vesselId: string): Observable<Vessel> => this.httpClient.get<Vessel>(this.VESSEL_URL + '/' + vesselId);

  updateVessel = (vessel: Vessel): Observable<Object> => this.httpClient.put(this.VESSEL_URL + '/' + vessel.vesselIMONumber, vessel);

  addVessel = (vessel: Vessel): Observable<Vessel> => this.httpClient.post<Vessel>(this.VESSEL_URL, vessel);

  getcarriers = (): Observable<Carrier[]> =>  this.httpClient.get<Carrier[]>(this.CARRIER_URL);

  updateVesselsObserverable() {
    this.vesselsDataSource.next(null);
  }
}
