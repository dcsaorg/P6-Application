import { Pipe, PipeTransform } from '@angular/core';
import {TransportCall} from "../../model/ovs/transport-call";
import {Vessel} from "../../model/portCall/vessel";
import {vesselOperatorCarrierCodeListProvider} from "../../model/enums/vesselOperatorCarrierCodeListProvider";

@Pipe({
  name: 'transportCallsToVessels'
})
export class TransportCallsToVesselsPipe implements PipeTransform {

  transform(transportCalls: TransportCall[]): Vessel[] {
    let vessels: Vessel[] = new Array();
    let imos = new Set
    for (let transportCall of transportCalls) {
      let vessel: Vessel = new class implements Vessel {
        vesselIMONumber: string;
        vesselName: string;
        serviceNameCode: string;
        teu: number;
        vesselFlag: string;
        vesselOperatorCarrierID: string;
        vesselCallSignNumber: string;
        vesselOperatorCarrierCode:string;
        vesselOperatorCarrierCodeListProvider: vesselOperatorCarrierCodeListProvider;
      }
      vessel.vesselIMONumber = transportCall.vesselIMONumber;
      vessel.vesselName = transportCall.vesselName;
      if (!imos.has(vessel.vesselIMONumber)) {
        vessels.push(vessel);
      }
      imos.add(vessel.vesselIMONumber)

    }

    return vessels;
  }

}
