import { Pipe, PipeTransform } from '@angular/core';
import { DimensionUnit } from 'src/app/model/enums/dimensionUnit';
import { Vessel } from '../../model/portCall/vessel';


@Pipe({
  name: 'vesselTooltip'
})
export class VesselTooltipPipe implements PipeTransform {

  transform(vessel: Vessel, milesToDestinationPort: string, vesselDraft: string, vesselDraftUnit?: DimensionUnit): string {
    let tooltip = '';
    let unit = vessel?.dimensionUnit;
    if (vesselDraftUnit) { unit = vesselDraftUnit; }
    if (milesToDestinationPort) { tooltip += `milesToDestinationPort: ${milesToDestinationPort} \n`; }
    if (vesselDraft) { tooltip += `vesselDraft: ${vesselDraft} ${unit} \n `; }
    if (vessel) {
      if (vessel.type) { tooltip += `Type: ${vessel.type}\n`; }
      if (vessel.width) { tooltip += `Width: ${vessel.width} ${vessel.dimensionUnit}\n`; }
      if (vessel.length) { tooltip += `Length: ${vessel.length} ${vessel.dimensionUnit}\n`; }
      if (vessel.vesselCallSignNumber) { tooltip += `Call sign: ${vessel.vesselCallSignNumber}\n`; }
    }
    if (tooltip === '') {
      tooltip = 'N/A';
    }
    return tooltip;
  }
}
