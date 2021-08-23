import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {FacilityCodeType} from "../../model/ovs/facilityCodeType";

@Pipe({
  name: 'timestampTypeToFacilityCodeCode'
})
export class TimestampTypeToFacilityCodeCodePipe implements PipeTransform {

  transform(timestampType: PortcallTimestampType): FacilityCodeType {
    let ret: FacilityCodeType = null;
 if(
      [PortcallTimestampType.ETD_Berth,
        PortcallTimestampType.PTD_Berth,
        PortcallTimestampType.RTD_Berth,
        PortcallTimestampType.ATD_Berth,
        PortcallTimestampType.ATA_Berth,
        PortcallTimestampType.ETA_Berth,
        PortcallTimestampType.PTA_Berth,
        PortcallTimestampType.RTA_Berth
      ].includes(timestampType)
    ) {ret = FacilityCodeType.BRTH}
    else if (
      [PortcallTimestampType.ETA_PBP,
        PortcallTimestampType.PTA_PBP,
        PortcallTimestampType.RTA_PBP,
        PortcallTimestampType.ATA_PBP
      ].includes(timestampType)
    ){
      ret = FacilityCodeType.PBPL
    }
    return ret;
  }

}
