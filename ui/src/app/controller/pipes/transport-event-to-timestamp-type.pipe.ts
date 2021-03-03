import {Pipe, PipeTransform} from '@angular/core';
import {TransportEvent} from "../../model/OVS/transport-event";
import {PortcallTimestampType} from "../../model/base/portcall-timestamp-type.enum";

@Pipe({
  name: 'transportEventToTimestampType'
})
export class TransportEventToTimestampTypePipe implements PipeTransform {

  transform(transportEvent: TransportEvent): PortcallTimestampType {
    if (transportEvent.eventTypeCode == "ARRI" && transportEvent.eventClassifierCode == "EST" && transportEvent.locationType == "BERTH") {
      return PortcallTimestampType.ETA_Berth
    } else if (transportEvent.eventTypeCode == "ARRI" && transportEvent.eventClassifierCode == "PLA" && transportEvent.locationType == "BERTH") {
      return PortcallTimestampType.PTA_Berth
    } else if (transportEvent.eventTypeCode == "ARRI" && transportEvent.eventClassifierCode == "REQ" && transportEvent.locationType == "BERTH") {
      return PortcallTimestampType.RTA_Berth
    } else if (transportEvent.eventTypeCode == "ARRI" && transportEvent.eventClassifierCode == "ACT" && transportEvent.locationType == "BERTH") {
      return PortcallTimestampType.ATA_Berth
    } else if (transportEvent.eventTypeCode == "DEPT" && transportEvent.eventClassifierCode == "EST" && transportEvent.locationType == "BERTH") {
      return PortcallTimestampType.ETD_Berth
    } else if (transportEvent.eventTypeCode == "DEPT" && transportEvent.eventClassifierCode == "PLA" && transportEvent.locationType == "BERTH") {
      return PortcallTimestampType.PTD_Berth
    } else if (transportEvent.eventTypeCode == "DEPT" && transportEvent.eventClassifierCode == "RLA" && transportEvent.locationType == "BERTH") {
      return PortcallTimestampType.RTD_Berth
    } else if (transportEvent.eventTypeCode == "DEPT" && transportEvent.eventClassifierCode == "ACT" && transportEvent.locationType == "BERTH") {
      return PortcallTimestampType.ATD_Berth
    } else if (transportEvent.eventTypeCode == "ARRI" && transportEvent.eventClassifierCode == "EST" && transportEvent.locationType == "PBP") {
      return PortcallTimestampType.ETA_PBP
    } else if (transportEvent.eventTypeCode == "ARRI" && transportEvent.eventClassifierCode == "PLA" && transportEvent.locationType == "PBP") {
      return PortcallTimestampType.PTA_PBP
    } else if (transportEvent.eventTypeCode == "ARRI" && transportEvent.eventClassifierCode == "REQ" && transportEvent.locationType == "PBP") {
      return PortcallTimestampType.RTA_PBP
    } else if (transportEvent.eventTypeCode == "ARRI" && transportEvent.eventClassifierCode == "ACT" && transportEvent.locationType == "PBP") {
      return PortcallTimestampType.ATA_PBP
    } else if (transportEvent.eventTypeCode == "COPS" && transportEvent.eventClassifierCode == "EST" && transportEvent.locationType == "CARGO_OPS") {
      return PortcallTimestampType.ETC_Cargo_Ops
    } else if (transportEvent.eventTypeCode == "COPS" && transportEvent.eventClassifierCode == "PLA" && transportEvent.locationType == "CARGO_OPS") {
      return PortcallTimestampType.PTC_Cargo_Ops
    } else if (transportEvent.eventTypeCode == "COPS" && transportEvent.eventClassifierCode == "REQ" && transportEvent.locationType == "CARGO_OPS") {
      return PortcallTimestampType.RTC_Cargo_Ops
    } else if (transportEvent.eventTypeCode == "COPS" && transportEvent.eventClassifierCode == "ACT" && transportEvent.locationType == "CARGO_OPS") {
      return PortcallTimestampType.ATC_Cargo_Ops
    } else if (transportEvent.eventTypeCode == "SCOPS" && transportEvent.eventClassifierCode == "ACT" && transportEvent.locationType == "CARGO_OPS") {
      return PortcallTimestampType.ATS
    } else {
      return null;
    }

  }
}
