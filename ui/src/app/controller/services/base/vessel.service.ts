import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {Vessel} from "../../../model/portCall/vessel";
import {Carrier} from "../../../model/portCall/carrier";
import {BACKEND_URL} from "../../../../environments/environment";
import {StaticVesselService} from "../static/static-vessel.service";
import {VesselMappingService} from "../mapping/vessel-mapping.service";


@Injectable({
  providedIn: 'root'
})
export class VesselService {
  private readonly VESSEL_URL: string;
  private readonly CARRIER_URL: string;

  constructor(private httpClient: HttpClient, private vesselMappingService: VesselMappingService, private staticVesselService: StaticVesselService) {
    this.VESSEL_URL = BACKEND_URL + '/unofficial-vessels';
    this.CARRIER_URL = BACKEND_URL + '/unofficial-carriers';
  }

  getVessels = (): Observable<Vessel[]> =>  this.httpClient.get<Vessel[]>(this.VESSEL_URL); //this.vesselMappingService.getVessels();

  getVessel = (vesselId: string): Observable<Vessel> => this.getVessels().pipe(map(vessels => vessels.find(vessel => vessel.vesselIMONumber == vesselId)));

  updateVessel = (vessel: Vessel): Observable<Object> => this.httpClient.put(this.VESSEL_URL + '/' + vessel.vesselIMONumber, vessel);

  addVessel = (vessel: Vessel): Observable<Vessel> => this.httpClient.post<Vessel>(this.VESSEL_URL, vessel);

  getcarriers = (): Observable<Carrier[]> =>  this.httpClient.get<Carrier[]>(this.CARRIER_URL);
 
}
