import {Injectable} from '@angular/core';
import {StaticVesselService} from "../static/static-vessel.service";
import {forkJoin, Observable, zip} from "rxjs";
import {Vessel} from "../../../model/base/vessel";
import {TransportCallService} from "../OVS/transport-call.service";
import {TransportCall} from "../../../model/OVS/transport-call";
import {concatMap, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class VesselMappingService {

  constructor(private staticVesselService: StaticVesselService,
              private transportCallService: TransportCallService) {
  }


  getVessels(): Observable<Vessel[]> {
    const tcVessels$ =  this.getVesselsFromTransportCalls();
    const staticVessels$ = this.staticVesselService.getVessels();
    return tcVessels$;
    // return tcVessels$.pipe(concatMap(tcVessels => staticVessels$.pipe(map(staticVessels => {tcVessels, staticVessels}))))
  }

  public getVesselsFromTransportCalls(): Observable<Vessel[]> {
    return this.transportCallService.getTransportCalls().pipe(map(transportCalls =>
      this.extractVesselsFromTransportCall(transportCalls)));

  }

  public extractVesselsFromTransportCall(transportCalls: TransportCall[]): Vessel[] {
    let vessels: Vessel[] = new Array();
    let imos = new Set
    for (let transportCall of transportCalls) {
      let vessel: Vessel = new class implements Vessel {
        id: number;
        imo: number;
        name: string;
        serviceNameCode: string;
        teu: number;
      }
      vessel.id = parseInt(transportCall.vesselIMONumber);;
      vessel.imo = parseInt(transportCall.vesselIMONumber);
      vessel.name = transportCall.vesselName;
      if (!imos.has(vessel.imo)) {
        vessels.push(vessel);
      }
      imos.add(vessel.imo)

    }

    return vessels;
  }

}
