import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {OperationsEventTypeCode} from "../../model/ovs/operationsEventTypeCode";

@Pipe({
  name: 'timestampTypeToEventType'
})
export class TimestampTypeToEventTypePipe implements PipeTransform {

  transform(timestampType: PortcallTimestampType): OperationsEventTypeCode {
    let ret: OperationsEventTypeCode
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
        ret = OperationsEventTypeCode.ARRI
      } else if (
        [PortcallTimestampType.ATD_Berth,
          PortcallTimestampType.RTD_Berth,
          PortcallTimestampType.PTD_Berth,
          PortcallTimestampType.ETD_Berth
        ].includes(timestampType)) {
        ret = OperationsEventTypeCode.DEPA
      } else if(
        [PortcallTimestampType.ATC_Cargo_Ops,
          PortcallTimestampType.PTC_Cargo_Ops,
          PortcallTimestampType.RTC_Cargo_Ops,
          PortcallTimestampType.ETC_Cargo_Ops
        ].includes(timestampType)
      ){ret = OperationsEventTypeCode.CMPL}
      else if (
       [PortcallTimestampType.ATS_Cargo_Ops,
         PortcallTimestampType.ATS_Pilotage
       ].includes(timestampType)){
        ret = OperationsEventTypeCode.STRT
      }
    return ret;
  }

}
