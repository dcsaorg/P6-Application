import { Pipe, PipeTransform } from '@angular/core';
import { Globals } from 'src/app/model/portCall/globals';
import { Vessel } from "../../model/portCall/vessel";


@Pipe({
  name: 'vesselTooltip'
})
export class VesselTooltipPipe implements PipeTransform {

  transform(vessel: Vessel): string {
    if (vessel) {
      var tooltip = "";
      if (vessel.type) tooltip += `Type: ${vessel.type}\n`;
      if (vessel.width) tooltip += `Width: ${vessel.width}\n`;
      if (vessel.length) tooltip += `Length: ${vessel.length}\n`;
      if (vessel.vesselCallSignNumber) tooltip += `Call sign: ${vessel.vesselCallSignNumber}\n`;
      return tooltip
    }
    return "N/A";
  }
}
