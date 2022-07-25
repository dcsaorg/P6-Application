import { Pipe, PipeTransform } from '@angular/core';
import { Vessel } from "../../model/portCall/vessel";


@Pipe({
  name: 'vesselTooltip'
})
export class VesselTooltipPipe implements PipeTransform {

  transform(vessel: Vessel): string {
    let tooltip = "";
    if (vessel) {
      if (vessel.type) tooltip += `Type: ${vessel.type}\n`;
      if (vessel.width) tooltip += `Width: ${vessel.width}\n`;
      if (vessel.length) tooltip += `Length: ${vessel.length}\n`;
      if (vessel.vesselCallSignNumber) tooltip += `Call sign: ${vessel.vesselCallSignNumber}\n`;
      if (vessel.vesselDraft) tooltip += `Draft: ${vessel.vesselDraft} ${vessel.dimensionUnit} \n `; // only show both draft & unit if draft is given
    }
    if (tooltip === "") {
      tooltip = "N/A";
    }
    return tooltip;
  }
}
