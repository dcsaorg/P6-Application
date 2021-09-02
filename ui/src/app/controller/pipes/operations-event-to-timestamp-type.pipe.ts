import {Pipe, PipeTransform} from '@angular/core';
import {OperationsEvent} from "../../model/ovs/operations-event";
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {OperationsEventTypeCode} from "../../model/ovs/operationsEventTypeCode";
import {PortCallServiceTypeCode} from "../../model/enums/portCallServiceTypeCode";
import {FacilityTypeCode} from "../../model/enums/facilityTypeCodeOPR";
import {EventClassifierCode} from "../../model/ovs/eventClassifierCode";

@Pipe({
  name: 'transportEventToTimestampType'
})
export class OperationsEventToTimestampTypePipe implements PipeTransform {

  transform(transportEvent: OperationsEvent): PortcallTimestampType {
    if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.EST && transportEvent.transportCall.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.ETA_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.PLN && transportEvent.transportCall.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.PTA_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.REQ && transportEvent.transportCall.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.RTA_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.ACT && transportEvent.transportCall.facilityTypeCode== FacilityTypeCode.BRTH) {
      return PortcallTimestampType.ATA_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && transportEvent.eventClassifierCode == EventClassifierCode.EST && transportEvent.transportCall.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.ETD_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && transportEvent.eventClassifierCode == EventClassifierCode.PLN && transportEvent.transportCall.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.PTD_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && transportEvent.eventClassifierCode == EventClassifierCode.REQ && transportEvent.transportCall.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.RTD_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && transportEvent.eventClassifierCode == EventClassifierCode.ACT && transportEvent.transportCall.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.ATD_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.EST && transportEvent.transportCall.facilityTypeCode == FacilityTypeCode.PBPL) {
      return PortcallTimestampType.ETA_PBP
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.PLN && transportEvent.transportCall.facilityTypeCode == FacilityTypeCode.PBPL) {
      return PortcallTimestampType.PTA_PBP
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.REQ && transportEvent.transportCall.facilityTypeCode == FacilityTypeCode.PBPL) {
      return PortcallTimestampType.RTA_PBP
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.ACT && transportEvent.transportCall.facilityTypeCode == FacilityTypeCode.PBPL) {
      return PortcallTimestampType.ATA_PBP
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && transportEvent.eventClassifierCode == EventClassifierCode.EST && transportEvent.transportCall.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.ETC_Cargo_Ops
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && transportEvent.eventClassifierCode == EventClassifierCode.PLN && transportEvent.transportCall.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.PTC_Cargo_Ops
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && transportEvent.eventClassifierCode == EventClassifierCode.REQ && transportEvent.transportCall.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.RTC_Cargo_Ops
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && transportEvent.eventClassifierCode == EventClassifierCode.ACT && transportEvent.transportCall.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.ATC_Cargo_Ops
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && transportEvent.eventClassifierCode == EventClassifierCode.ACT && transportEvent.transportCall.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.ATS_Cargo_Ops
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && transportEvent.eventClassifierCode == EventClassifierCode.ACT && transportEvent.transportCall.portCallServiceTypeCode == PortCallServiceTypeCode.PILO) {
      return PortcallTimestampType.ATS_Pilot
    } else {
      console.log("SHOULD REURN NULL")
      return PortcallTimestampType.PTA_Berth;  // Should return null 
    }

  }
}
