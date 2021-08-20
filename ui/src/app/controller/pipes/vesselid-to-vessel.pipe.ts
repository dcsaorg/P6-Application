import {Pipe, PipeTransform} from '@angular/core';
import {Vessel} from "../../model/portCall/vessel";

@Pipe({
  name: 'vesselIdToVessel'
})
export class VesselIdToVesselPipe implements PipeTransform {

  transform(vesselId: number, vessels: Vessel[]): Vessel {
    const vesselNotFound: Vessel = {
      vesselIMONumber: vesselId,
      vesselName: '',
      serviceNameCode: '',
      teu: -1,
      vesselFlag: '',
      vesselCallSignNumber: '',
      vesselOperatorCarrierID: '',
      vesselOperatorCarrierCode: '',
       vesselOperatorCarrierCodeListProvider: null
    }
    console.log("vessels pip");
    console.log(vessels);
    console.log(vesselId);
    const vesselFound = vessels.find(vessel => vessel.vesselIMONumber == vesselId)
    return vesselFound ? vesselFound : vesselNotFound;
  }

}
