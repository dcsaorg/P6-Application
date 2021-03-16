import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestampType} from "../../model/base/portcall-timestamp-type.enum";

@Pipe({
  name: 'timestampTypeToLocationType'
})
export class TimestampTypeToLocationTypePipe implements PipeTransform {

  transform(timestampType: PortcallTimestampType): string {
    let ret: string = "";
    if(
      [PortcallTimestampType.ETC_Cargo_Ops,
        PortcallTimestampType.ATS,
        PortcallTimestampType.RTC_Cargo_Ops,
        PortcallTimestampType.PTC_Cargo_Ops,
        PortcallTimestampType.ATC_Cargo_Ops
      ].includes(timestampType)){
      ret = "CARGO_OPS"
    } else if(
      [PortcallTimestampType.ETD_Berth,
        PortcallTimestampType.PTD_Berth,
        PortcallTimestampType.RTD_Berth,
        PortcallTimestampType.ATD_Berth,
        PortcallTimestampType.ATA_Berth,
        PortcallTimestampType.ETA_Berth,
        PortcallTimestampType.PTA_Berth,
        PortcallTimestampType.RTA_Berth
      ].includes(timestampType)
    ) {ret = "BERTH"}
    else if (
      [PortcallTimestampType.ETA_PBP,
        PortcallTimestampType.PTA_PBP,
        PortcallTimestampType.RTA_PBP,
        PortcallTimestampType.ATA_PBP
      ].includes(timestampType)
    ){
      ret = "PBP"
    }
    return ret;
  }

}
