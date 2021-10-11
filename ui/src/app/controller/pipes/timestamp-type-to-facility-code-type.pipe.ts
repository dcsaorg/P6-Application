import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {FacilityTypeCode} from "../../model/enums/facilityTypeCodeOPR";

@Pipe({
  name: 'timestampTypeToFacilityCodeCode'
})
export class TimestampTypeToFacilityCodeCodePipe implements PipeTransform {

  transform(timestampType: PortcallTimestampType): FacilityTypeCode {
    let ret: FacilityTypeCode = null;
    if (
      [
        PortcallTimestampType.ETD_Berth,
        PortcallTimestampType.PTD_Berth,
        PortcallTimestampType.RTD_Berth,
        PortcallTimestampType.ATD_Berth,
        PortcallTimestampType.ATA_Berth,
        PortcallTimestampType.ETA_Berth,
        PortcallTimestampType.PTA_Berth,
        PortcallTimestampType.RTA_Berth,
        PortcallTimestampType.ETS_Cargo_Ops,
        PortcallTimestampType.RTS_Cargo_Ops,
        PortcallTimestampType.PTS_Cargo_Ops,
        PortcallTimestampType.ETS_Bunkering,
        PortcallTimestampType.ETC_Bunkering,
        PortcallTimestampType.RTS_Bunkering,
        PortcallTimestampType.RTC_Bunkering,
        PortcallTimestampType.PTS_Bunkering,
        PortcallTimestampType.PTC_Bunkering,
        PortcallTimestampType.AT_All_Fast,
        PortcallTimestampType.Gangway_Down_and_Safe,
        PortcallTimestampType.Vessel_Readiness_for_Cargo_Ops,
        PortcallTimestampType.ATS_Bunkering,
        PortcallTimestampType.ATC_Bunkering,
        PortcallTimestampType.ATC_Lashing,
        PortcallTimestampType.Terminal_Ready_for_Vessel_Departure,
        PortcallTimestampType.ATS_Cargo_Ops,
        PortcallTimestampType.ETC_Cargo_Ops,
        PortcallTimestampType.PTC_Cargo_Ops,
        PortcallTimestampType.ATC_Cargo_Ops,
        PortcallTimestampType.RTC_Cargo_Ops

      ].includes(timestampType)
    ) {
      ret = FacilityTypeCode.BRTH
    } else if (
      [
        PortcallTimestampType.ETA_PBP,
        PortcallTimestampType.PTA_PBP,
        PortcallTimestampType.RTA_PBP,
        PortcallTimestampType.ATA_PBP,
        
      ].includes(timestampType)
    ) {
      ret = FacilityTypeCode.PBPL
    }
    return ret;
  }

}
