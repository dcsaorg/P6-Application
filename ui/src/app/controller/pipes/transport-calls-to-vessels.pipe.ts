import { Pipe, PipeTransform } from '@angular/core';
import {TransportCall} from "../../model/OVS/transport-call";
import {Vessel} from "../../model/portCall/vessel";

@Pipe({
  name: 'transportCallsToVessels'
})
export class TransportCallsToVesselsPipe implements PipeTransform {

  transform(transportCalls: TransportCall[]): Vessel[] {
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
      vessel.id = Number(transportCall.vessel.vesselIMONumber);
      vessel.imo = Number(transportCall.vessel.vesselIMONumber);
      vessel.name = transportCall.vessel.vesselName;
      if (!imos.has(vessel.imo)) {
        vessels.push(vessel);
      }
      imos.add(vessel.imo)

    }

    return vessels;
  }

}
