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
        vesselIMONumber: number;
        vesselName: string;
        serviceNameCode: string;
        teu: number;
        vesselFlag: string;
        vesselOperatorCarrierID: string;
        vesselCallSignNumber: string;
      }
      // vessel.id = parseInt(transportCall.vesselIMONumber);
      vessel.vesselIMONumber = parseInt(transportCall.vesselIMONumber);
      vessel.vesselName = transportCall.vesselName;
      if (!imos.has(vessel.vesselIMONumber)) {
        vessels.push(vessel);
      }
      imos.add(vessel.vesselIMONumber)

    }

    return vessels;
  }

}
