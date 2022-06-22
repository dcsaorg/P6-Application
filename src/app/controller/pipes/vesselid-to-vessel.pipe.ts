import {Pipe, PipeTransform} from '@angular/core';
import {Vessel} from "../../model/portCall/vessel";

@Pipe({
  name: 'vesselIdToVessel'
})
export class VesselIdToVesselPipe implements PipeTransform {

  transform(vesselId: string, vessels: Vessel[]): Vessel {
    const vesselNotFound: Vessel = {
      id: vesselId,
      vesselIMONumber: '',
      vesselName: '',
      serviceNameCode: '',
      vesselFlag: '',
      vesselCallSignNumber: '',
      vesselOperatorCarrierID: '',
      vesselOperatorCarrierCode: '',
       vesselOperatorCarrierCodeListProvider: null
    }
    const vesselFound = vessels.find(vessel => vessel.vesselIMONumber == vesselId)
    return vesselFound ? vesselFound : vesselNotFound;
  }

}
