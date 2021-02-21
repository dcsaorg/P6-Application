import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Vessel} from "../../../model/base/vessel";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StaticVesselService {
private VESSEL_FILE: string;

  constructor(private httpClient: HttpClient) {this.httpClient = httpClient
    this.VESSEL_FILE = "/assets/static_data/vessels.json";
  }

  getVessels= (): Observable<Vessel[]> => this.httpClient.get<Vessel[]>(this.VESSEL_FILE);

  getVessel(id: number): Observable<Vessel>{
    return this.getVessels().pipe(map(vessels => vessels.find(vessel => vessel.id == id)));

    }

}
