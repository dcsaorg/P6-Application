import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {Vessel} from "../../../model/portCall/vessel";
import {BACKEND_URL} from "../../../../environments/environment";
import {StaticVesselService} from "../static/static-vessel.service";
import {VesselMappingService} from "../mapping/vessel-mapping.service";
import {map} from "rxjs/operators";
import {Carrier} from "../../../model/portCall/carrier";

@Injectable({
  providedIn: 'root'
})
export class VesselService {
  private readonly VESSEL_URL: string;
  private readonly CARRIERS_URL: string;

  constructor(private httpClient: HttpClient, private vesselMappingService: VesselMappingService, private staticVesselService: StaticVesselService) {
    this.VESSEL_URL = BACKEND_URL + '/vessels';
    this.CARRIERS_URL = BACKEND_URL + '/carriers';
  }

  getVessels = (): Observable<Vessel[]> =>  this.httpClient.get<Vessel[]>(this.VESSEL_URL); //this.vesselMappingService.getVessels();
  getVessel = (vesselId: number): Observable<Vessel> => this.getVessels().pipe(map(vessels => vessels.find(vessel => vessel.vesselIMONumber == vesselId)));

  getCarriers = (): Observable<Carrier[]> =>  this.httpClient.get<Carrier[]>(this.CARRIERS_URL); //this.vesselMappingService.getVessels();
  getCarrier = (carrierId: string): Observable<Carrier> => this.getCarriers().pipe(map(carriers => carriers.find(carrier => carrier.id == carrierId)));

  updateVessel = (vessel: Vessel): Observable<Object> => this.httpClient.put(this.VESSEL_URL + '/' + vessel.vesselIMONumber, vessel);

  addVessel = (vessel: Vessel): Observable<Vessel> => this.httpClient.post<Vessel>(this.VESSEL_URL, vessel);
}
