import {Pipe, PipeTransform} from '@angular/core';
import {OperationsEvent} from "../../model/OVS/operations-event";
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {OperationsEventTypeCode} from "../../model/OVS/operationsEventTypeCode";
import {PortCallServiceTypeCode} from "../../model/OVS/portCallServiceTypeCode";
import {FacilityCodeType} from "../../model/OVS/facilityCodeType";
import {EventClassifierCode} from "../../model/OVS/eventClassifierCode";

@Pipe({
  name: 'transportEventToTimestampType'
})
export class OperationsEventToTimestampTypePipe implements PipeTransform {

  transform(transportEvent: OperationsEvent): PortcallTimestampType {
    if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.EST && transportEvent.facilityTypeCode == FacilityCodeType.BRTH) {
      return PortcallTimestampType.ETA_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.PLN && transportEvent.facilityTypeCode == FacilityCodeType.BRTH) {
      return PortcallTimestampType.PTA_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.REQ && transportEvent.facilityTypeCode == FacilityCodeType.BRTH) {
      return PortcallTimestampType.RTA_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.ACT && transportEvent.facilityTypeCode == FacilityCodeType.BRTH) {
      return PortcallTimestampType.ATA_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && transportEvent.eventClassifierCode == EventClassifierCode.EST && transportEvent.facilityTypeCode == FacilityCodeType.BRTH) {
      return PortcallTimestampType.ETD_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && transportEvent.eventClassifierCode == EventClassifierCode.PLN && transportEvent.facilityTypeCode == FacilityCodeType.BRTH) {
      return PortcallTimestampType.PTD_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && transportEvent.eventClassifierCode == EventClassifierCode.REQ && transportEvent.facilityTypeCode == FacilityCodeType.BRTH) {
      return PortcallTimestampType.RTD_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && transportEvent.eventClassifierCode == EventClassifierCode.ACT && transportEvent.facilityTypeCode == FacilityCodeType.BRTH) {
      return PortcallTimestampType.ATD_Berth
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.EST && transportEvent.facilityTypeCode == FacilityCodeType.PBPL) {
      return PortcallTimestampType.ETA_PBP
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.PLN && transportEvent.facilityTypeCode == FacilityCodeType.PBPL) {
      return PortcallTimestampType.PTA_PBP
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.REQ && transportEvent.facilityTypeCode == FacilityCodeType.PBPL) {
      return PortcallTimestampType.RTA_PBP
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && transportEvent.eventClassifierCode == EventClassifierCode.ACT && transportEvent.facilityTypeCode == FacilityCodeType.PBPL) {
      return PortcallTimestampType.ATA_PBP
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && transportEvent.eventClassifierCode == EventClassifierCode.EST && transportEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.ETC_Cargo_Ops
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && transportEvent.eventClassifierCode == EventClassifierCode.PLN && transportEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.PTC_Cargo_Ops
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && transportEvent.eventClassifierCode == EventClassifierCode.REQ && transportEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.RTC_Cargo_Ops
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && transportEvent.eventClassifierCode == EventClassifierCode.ACT && transportEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.ATC_Cargo_Ops
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && transportEvent.eventClassifierCode == EventClassifierCode.ACT && transportEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.ATS_Cargo_Ops
    } else if (transportEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && transportEvent.eventClassifierCode == EventClassifierCode.ACT && transportEvent.portCallServiceTypeCode == PortCallServiceTypeCode.PILO) {
      return PortcallTimestampType.ATS_Pilot
    } else {
      return null;
    }

  }
}
