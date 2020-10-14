import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {Vessel} from "./model/vessel";
import {BACKEND_URL} from "../environments/environment";
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class VesselService {
  private VESSEL_URL: string;

  constructor(private httpClient: HttpClient, private messageService: MessageService) {
    this.VESSEL_URL = BACKEND_URL + '/vessels';
  }

  getVessels = (): Observable<Vessel[]> => {
    return this.httpClient.get<Vessel[]>(this.VESSEL_URL);
  }

  updateVessel = (vessel: Vessel): void => {
    this.httpClient.put(this.VESSEL_URL + '/' + vessel.id, vessel).subscribe(() => {
      this.messageService.add({
        key: 'vesselUpdateSuccess',
        severity: 'success',
        summary: 'Successfully updated vessel',
        detail: ''
      });
    }, error => {
      this.messageService.add({
        key: 'vesselUpdateError',
        severity: 'error',
        summary: 'Successfully updated vessel',
        detail: error.message
      });
    });
  };

  addVessel(vessel: Vessel) {
    this.httpClient.post(this.VESSEL_URL, vessel).subscribe(() => {
      this.messageService.add({
        key: 'vesselAddSuccess',
        severity: 'success',
        summary: 'Successfully added vessel',
        detail: ''
      });
    }, error => this.messageService.add({
      key: 'vesselAddError',
      severity: 'error',
      summary: 'Successfully added Vessel',
      detail: error.message
    }));
  };
}
