import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {EventClassifierCode} from "../../model/ovs/eventClassifierCode";

@Pipe({
  name: 'timestampTypeToEventClassifierCode'
})
export class TimestampTypeToEventClassifierCodePipe implements PipeTransform {

  transform(timestampType: PortcallTimestampType): EventClassifierCode {
    let ret: EventClassifierCode
    if (
      [
        PortcallTimestampType.ETA_Berth,
        PortcallTimestampType.ETC_Cargo_Ops,
        PortcallTimestampType.ETA_PBP,
        PortcallTimestampType.ETD_Berth,
        PortcallTimestampType.ETS_Cargo_Ops,
        PortcallTimestampType.ETS_Bunkering,
        PortcallTimestampType.ETC_Bunkering

      ]
        .includes(timestampType)) {
      ret = EventClassifierCode.EST

    } else if (
      [
        PortcallTimestampType.PTC_Cargo_Ops,
        PortcallTimestampType.PTD_Berth,
        PortcallTimestampType.PTA_Berth,
        PortcallTimestampType.PTA_PBP,
        PortcallTimestampType.PTS_Cargo_Ops,
        PortcallTimestampType.PTS_Pilotage,
        PortcallTimestampType.PTS_Bunkering,
        PortcallTimestampType.PTC_Bunkering

      ]
        .includes(timestampType)) {
      ret = EventClassifierCode.PLN
    } else if (
      [
        PortcallTimestampType.RTA_Berth,
        PortcallTimestampType.RTA_PBP,
        PortcallTimestampType.RTC_Cargo_Ops,
        PortcallTimestampType.RTD_Berth,
        PortcallTimestampType.RTS_Cargo_Ops,
        PortcallTimestampType.RTS_Pilotage,
        PortcallTimestampType.RTS_Towage,
        PortcallTimestampType.RTC_Bunkering,
        PortcallTimestampType.RTS_Bunkering
      ]
        .includes(timestampType)) {
      ret = EventClassifierCode.REQ
    } else if (
      [
        PortcallTimestampType.ATS_Cargo_Ops,
        PortcallTimestampType.ATS_Pilotage,
        PortcallTimestampType.ATA_Berth,
        PortcallTimestampType.ATA_PBP,
        PortcallTimestampType.ATC_Cargo_Ops,
        PortcallTimestampType.ATD_Berth,
        PortcallTimestampType.EOSP,
        PortcallTimestampType.ATS_Pilotage,
        PortcallTimestampType.ATS_Towage,
        PortcallTimestampType.ATC_Towage,
        PortcallTimestampType.AT_All_Fast,
        PortcallTimestampType.Gangway_Down_and_Safe,
        PortcallTimestampType.Vessel_Readiness_for_Cargo_Ops,
        PortcallTimestampType.ATS_Bunkering,
        PortcallTimestampType.ATC_Bunkering,
        PortcallTimestampType.ATC_Lashing,
        PortcallTimestampType.Terminal_Ready_for_Vessel_Departure,
        PortcallTimestampType.ATC_Pilotage,
        PortcallTimestampType.SOSP
      ]
        .includes(timestampType)) {
      ret = EventClassifierCode.ACT
    }
    return ret;
  }

}
