import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {PortCallServiceTypeCode} from "../../model/enums/portCallServiceTypeCode";

@Pipe({
  name: 'timestampTypeToPortcallServiceTypeCode'
})
export class TimestampTypeToPortcallServiceTypeCodePipe implements PipeTransform {

  transform(timestampType: PortcallTimestampType): PortCallServiceTypeCode {
    let ret: PortCallServiceTypeCode = null;
    if(
      [
        PortcallTimestampType.ETC_Cargo_Ops,
        PortcallTimestampType.ATS_Cargo_Ops,
        PortcallTimestampType.RTC_Cargo_Ops,
        PortcallTimestampType.PTC_Cargo_Ops,
        PortcallTimestampType.ATC_Cargo_Ops,
        PortcallTimestampType.ETS_Cargo_Ops,
        PortcallTimestampType.RTS_Cargo_Ops,
        PortcallTimestampType.PTS_Cargo_Ops
      ].includes(timestampType)){
      ret = PortCallServiceTypeCode.CRGO
    } else if (
      [
        PortcallTimestampType.ATS_Pilotage,
        PortcallTimestampType.RTS_Pilotage,
        PortcallTimestampType.PTS_Pilotage,
        PortcallTimestampType.ATC_Pilotage,
      ].includes(timestampType)
    ) {
      ret = PortCallServiceTypeCode.PILO
    } else if (
      [
        PortcallTimestampType.ATC_Towage,
        PortcallTimestampType.RTS_Towage,
        PortcallTimestampType.PTS_Towage,
        PortcallTimestampType.ATS_Towage  
      ].includes(timestampType)
    ) {
      ret = PortCallServiceTypeCode.TOWG
    } else if (
      [
        PortcallTimestampType.ETS_Bunkering,
        PortcallTimestampType.ETC_Bunkering,
        PortcallTimestampType.RTS_Bunkering,
        PortcallTimestampType.RTC_Bunkering,
        PortcallTimestampType.PTC_Bunkering,
        PortcallTimestampType.PTS_Bunkering,
        PortcallTimestampType.ATS_Bunkering,
        PortcallTimestampType.ATC_Bunkering,
      ].includes(timestampType)
    ) {
      ret = PortCallServiceTypeCode.BUNK
    } else if (
      [
        PortcallTimestampType.AT_All_Fast
      ].includes(timestampType)
    ) {
      ret = PortCallServiceTypeCode.FAST
    } else if (
      [
        PortcallTimestampType.Gangway_Down_and_Safe
      ].includes(timestampType)
    ) {
      ret = PortCallServiceTypeCode.GWAY
    } else if (
      [
        PortcallTimestampType.Vessel_Readiness_for_Cargo_Ops,
        PortcallTimestampType.Terminal_Ready_for_Vessel_Departure
      ].includes(timestampType)
      ) {
        ret = PortCallServiceTypeCode.SAFE
      } else if (
      [
        PortcallTimestampType.ATC_Lashing 
      ].includes(timestampType)
      ) {
        ret = PortCallServiceTypeCode.LASH
      } return ret;
  }

}
