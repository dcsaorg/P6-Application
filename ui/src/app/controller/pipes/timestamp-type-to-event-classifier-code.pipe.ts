import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestampType} from "../../model/base/portcall-timestamp-type.enum";

@Pipe({
  name: 'timestampTypeToEventClassifierCode'
})
export class TimestampTypeToEventClassifierCodePipe implements PipeTransform {

  transform(timestampType: PortcallTimestampType): string {
    let ret: string = ""
    if (
      [PortcallTimestampType.ETA_Berth,
        PortcallTimestampType.ETC_Cargo_Ops,
        PortcallTimestampType.ETA_PBP,
        PortcallTimestampType.ETD_Berth]
        .includes(timestampType)) {
      ret = "EST"

    } else if (
      [PortcallTimestampType.PTC_Cargo_Ops,
        PortcallTimestampType.PTD_Berth,
        PortcallTimestampType.PTA_Berth,
        PortcallTimestampType.PTA_PBP]
        .includes(timestampType)) {
      ret = "PLN"
    } else if (
      [PortcallTimestampType.RTA_Berth,
        PortcallTimestampType.RTA_PBP,
        PortcallTimestampType.RTC_Cargo_Ops,
        PortcallTimestampType.RTD_Berth]
        .includes(timestampType)) {
      ret = "REQ"
    } else if (
      [PortcallTimestampType.ATS,
        PortcallTimestampType.ATA_Berth,
        PortcallTimestampType.ATA_PBP,
        PortcallTimestampType.ATC_Cargo_Ops,
        PortcallTimestampType.ATD_Berth]
        .includes(timestampType)) {
      ret = "REQ"
    }
    return ret;
  }

}
