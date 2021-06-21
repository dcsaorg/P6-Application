import {Pipe, PipeTransform} from '@angular/core';
import {Vessel} from "../../model/portCall/vessel";

@Pipe({
  name: 'vesselIdToVessel'
})
export class VesselIdToVesselPipe implements PipeTransform {

  transform(vesselId: number, vessels: Vessel[]): Vessel {
    const vesselNotFound: Vessel = {
      vesselIMONumber: vesselId,
      serviceNameCode: '',
      vesselName: '',
      teu: -1,
      vesselFlag: '',
      vesselCallSignNumber: '',
      vesselOperatorCarrierID: ''
    }
    const vesselFound = vessels.find(vessel => vessel.vesselIMONumber === vesselId)
    return vesselFound ? vesselFound : vesselNotFound;
  }

}
