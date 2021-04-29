import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {EventClassifierCode} from "../../model/OVS/eventClassifierCode";

@Pipe({
  name: 'timestampTypeToEventClassifierCode'
})
export class TimestampTypeToEventClassifierCodePipe implements PipeTransform {

  transform(timestampType: PortcallTimestampType): EventClassifierCode {
    let ret: EventClassifierCode
    if (
      [PortcallTimestampType.ETA_Berth,
        PortcallTimestampType.ETC_Cargo_Ops,
        PortcallTimestampType.ETA_PBP,
        PortcallTimestampType.ETD_Berth]
        .includes(timestampType)) {
      ret = EventClassifierCode.EST

    } else if (
      [PortcallTimestampType.PTC_Cargo_Ops,
        PortcallTimestampType.PTD_Berth,
        PortcallTimestampType.PTA_Berth,
        PortcallTimestampType.PTA_PBP]
        .includes(timestampType)) {
      ret = EventClassifierCode.PLN
    } else if (
      [PortcallTimestampType.RTA_Berth,
        PortcallTimestampType.RTA_PBP,
        PortcallTimestampType.RTC_Cargo_Ops,
        PortcallTimestampType.RTD_Berth]
        .includes(timestampType)) {
      ret = EventClassifierCode.REQ
    } else if (
      [PortcallTimestampType.ATS_Cargo_Ops,
        PortcallTimestampType.ATS_Pilot,
        PortcallTimestampType.ATA_Berth,
        PortcallTimestampType.ATA_PBP,
        PortcallTimestampType.ATC_Cargo_Ops,
        PortcallTimestampType.ATD_Berth]
        .includes(timestampType)) {
      ret = EventClassifierCode.ACT
    }
    return ret;
  }

}
