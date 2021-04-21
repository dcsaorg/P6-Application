import {Pipe, PipeTransform} from '@angular/core';
import {Vessel} from "../../model/portCall/vessel";

@Pipe({
  name: 'vesselIdToVessel'
})
export class VesselIdToVesselPipe implements PipeTransform {

  transform(vesselId: number, vessels: Vessel[]): Vessel {
    const vesselNotFound: Vessel = {
      id: vesselId,
      serviceNameCode: '',
      name: '',
      teu: -1,
      imo: -1
    }
    const vesselFound = vessels.find(vessel => vessel.id === vesselId)
    return vesselFound ? vesselFound : vesselNotFound;
  }

}
