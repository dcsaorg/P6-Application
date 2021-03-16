import { Pipe, PipeTransform } from '@angular/core';
import {PortcallTimestampType} from "../../model/base/portcall-timestamp-type.enum";

@Pipe({
  name: 'timestampTypeToEventType'
})
export class TimestampTypeToEventTypePipe implements PipeTransform {

  transform(timestampType: PortcallTimestampType): string {
    let ret: string =""
      if(
        [PortcallTimestampType.ATA_PBP,
          PortcallTimestampType.RTA_PBP,
          PortcallTimestampType.RTA_Berth,
          PortcallTimestampType.PTA_PBP,
          PortcallTimestampType.PTA_Berth,
          PortcallTimestampType.ETA_PBP,
          PortcallTimestampType.ETA_Berth,
          PortcallTimestampType.ATA_Berth
        ].includes(timestampType)) {
        ret = "ARRI"
      } else if (
        [PortcallTimestampType.ATD_Berth,
          PortcallTimestampType.RTD_Berth,
          PortcallTimestampType.PTD_Berth,
          PortcallTimestampType.ETD_Berth
        ].includes(timestampType)) {
        ret = "DEPT"
      } else if(
        [PortcallTimestampType.ATC_Cargo_Ops,
          PortcallTimestampType.PTC_Cargo_Ops,
          PortcallTimestampType.RTC_Cargo_Ops,
          PortcallTimestampType.ETC_Cargo_Ops
        ].includes(timestampType)
      ){ret = "COPS"}
      else if (
       [PortcallTimestampType.ATS
       ].includes(timestampType)){
        ret = "SOPS"
      }
    return ret;
  }

}
