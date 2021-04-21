import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {Vessel} from "../../../model/portCall/vessel";
import {BACKEND_URL} from "../../../../environments/environment";
import {StaticVesselService} from "../static/static-vessel.service";
import {VesselMappingService} from "../mapping/vessel-mapping.service";

@Injectable({
  providedIn: 'root'
})
export class VesselService {
  private readonly VESSEL_URL: string;

  constructor(private httpClient: HttpClient, private vesselMappingService: VesselMappingService, private staticVesselService: StaticVesselService) {
    this.VESSEL_URL = BACKEND_URL + '/vessels';
  }

  getVessels = (): Observable<Vessel[]> => this.vesselMappingService.getVessels();

  getVessel = (vesselId: number): Observable<Vessel> => this.staticVesselService.getVessel(vesselId);

  updateVessel = (vessel: Vessel): Observable<Object> => this.httpClient.put(this.VESSEL_URL + '/' + vessel.id, vessel);

  addVessel = (vessel: Vessel): Observable<Vessel> => this.httpClient.post<Vessel>(this.VESSEL_URL, vessel);
}
