import {Injectable} from '@angular/core';
import {StaticVesselService} from "../static/static-vessel.service";
import {concat, forkJoin, Observable, zip} from "rxjs";
import {Vessel} from "../../../model/portCall/vessel";
import {TransportCallService} from "../OVS/transport-call.service";
import {concatMap, map} from "rxjs/operators";
import {TransportCallsToVesselsPipe} from "../../pipes/transport-calls-to-vessels.pipe";

@Injectable({
  providedIn: 'root'
})
export class VesselMappingService {

  constructor(private staticVesselService: StaticVesselService,
              private transportCallService: TransportCallService,
              private transportCallsToVesselPipe: TransportCallsToVesselsPipe) {
  }


  getVessels(): Observable<Vessel[]> {


    const $tcVessels =  this.getVesselsFromTransportCalls();
    //const $staticVessels = this.staticVesselService.getVessels();
    const $combined =$tcVessels;
    return $combined;


    // return tcVessels$.pipe(concatMap(tcVessels => staticVessels$.pipe(map(staticVessels => {tcVessels, staticVessels}))))
  }


  public getVesselsFromTransportCalls(): Observable<Vessel[]> {
    return this.transportCallService.getTransportCalls().pipe(map(transportCalls =>
      this.transportCallsToVesselPipe.transform(transportCalls)));

  }

}
