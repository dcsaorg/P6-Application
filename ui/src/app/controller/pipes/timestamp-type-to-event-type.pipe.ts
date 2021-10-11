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
        [
          PortcallTimestampType.ATA_PBP,
          PortcallTimestampType.RTA_PBP,
          PortcallTimestampType.RTA_Berth,
          PortcallTimestampType.PTA_PBP,
          PortcallTimestampType.PTA_Berth,
          PortcallTimestampType.ETA_PBP,
          PortcallTimestampType.ETA_Berth,
          PortcallTimestampType.ATA_Berth,
          PortcallTimestampType.AT_All_Fast,
          PortcallTimestampType.Gangway_Down_and_Safe,
          PortcallTimestampType.Vessel_Readiness_for_Cargo_Ops,
          PortcallTimestampType.EOSP
        ].includes(timestampType)) {
        ret = OperationsEventTypeCode.ARRI
      } else if (
        [
          PortcallTimestampType.ATD_Berth,
          PortcallTimestampType.RTD_Berth,
          PortcallTimestampType.PTD_Berth,
          PortcallTimestampType.ETD_Berth,
          PortcallTimestampType.Terminal_Ready_for_Vessel_Departure,
          PortcallTimestampType.SOSP
        ].includes(timestampType)) {
        ret = OperationsEventTypeCode.DEPA
      } else if(
        [
          PortcallTimestampType.ATC_Cargo_Ops,
          PortcallTimestampType.PTC_Cargo_Ops,
          PortcallTimestampType.RTC_Cargo_Ops,
          PortcallTimestampType.ETC_Cargo_Ops,
          PortcallTimestampType.ETC_Bunkering,
          PortcallTimestampType.RTC_Bunkering,
          PortcallTimestampType.PTC_Bunkering,
          PortcallTimestampType.ATC_Towage,
          PortcallTimestampType.ATC_Bunkering,
          PortcallTimestampType.ATC_Lashing,
          PortcallTimestampType.ATC_Pilotage
        ].includes(timestampType)
      ) {
        ret = OperationsEventTypeCode.CMPL
      } else if (
       [
         PortcallTimestampType.ATS_Cargo_Ops,
         PortcallTimestampType.ATS_Pilotage,
         PortcallTimestampType.ETS_Cargo_Ops,
         PortcallTimestampType.RTS_Cargo_Ops,
         PortcallTimestampType.PTS_Cargo_Ops,
         PortcallTimestampType.RTS_Pilotage,
         PortcallTimestampType.RTS_Towage,
         PortcallTimestampType.PTS_Pilotage,
         PortcallTimestampType.PTS_Towage,
         PortcallTimestampType.ETS_Bunkering,
         PortcallTimestampType.RTS_Bunkering,
         PortcallTimestampType.PTS_Bunkering,
         PortcallTimestampType.ATS_Towage,
         PortcallTimestampType.ATS_Bunkering,

       ].includes(timestampType)){
        ret = OperationsEventTypeCode.STRT
      }
    return ret;
  }

}
