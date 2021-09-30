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

  transform(operationEvent: OperationsEvent): PortcallTimestampType {
    if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && operationEvent.eventClassifierCode == EventClassifierCode.EST && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.ETC_Cargo_Ops
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.EST && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.ETS_Cargo_Ops
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && operationEvent.eventClassifierCode == EventClassifierCode.PLN && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.PTC_Cargo_Ops
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && operationEvent.eventClassifierCode == EventClassifierCode.REQ && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.RTC_Cargo_Ops
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.EST && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.RTS_Cargo_Ops
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.PLN && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.PTS_Cargo_Ops
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.ATC_Cargo_Ops
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.CRGO) {
      return PortcallTimestampType.ATS_Cargo_Ops
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.PILO) {
      return PortcallTimestampType.ATS_Pilotage
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && operationEvent.eventClassifierCode == EventClassifierCode.EST && operationEvent.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.ETA_Berth
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && operationEvent.eventClassifierCode == EventClassifierCode.PLN && operationEvent.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.PTA_Berth
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && operationEvent.eventClassifierCode == EventClassifierCode.REQ && operationEvent.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.RTA_Berth
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.facilityTypeCode== FacilityTypeCode.BRTH) {
      return PortcallTimestampType.ATA_Berth
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && operationEvent.eventClassifierCode == EventClassifierCode.EST && operationEvent.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.ETD_Berth
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && operationEvent.eventClassifierCode == EventClassifierCode.PLN && operationEvent.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.PTD_Berth
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && operationEvent.eventClassifierCode == EventClassifierCode.REQ && operationEvent.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.RTD_Berth
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.facilityTypeCode == FacilityTypeCode.BRTH) {
      return PortcallTimestampType.ATD_Berth
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && operationEvent.eventClassifierCode == EventClassifierCode.EST && operationEvent.facilityTypeCode == FacilityTypeCode.PBPL) {
      return PortcallTimestampType.ETA_PBP
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && operationEvent.eventClassifierCode == EventClassifierCode.PLN && operationEvent.facilityTypeCode == FacilityTypeCode.PBPL) {
      return PortcallTimestampType.PTA_PBP
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && operationEvent.eventClassifierCode == EventClassifierCode.REQ && operationEvent.facilityTypeCode == FacilityTypeCode.PBPL) {
      return PortcallTimestampType.RTA_PBP
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.facilityTypeCode == FacilityTypeCode.PBPL) {
      return PortcallTimestampType.ATA_PBP
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.REQ && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.PILO) {
      return PortcallTimestampType.RTS_Pilotage
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.PLN && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.PILO) {
      return PortcallTimestampType.PTS_Pilotage
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.PILO) {
      return PortcallTimestampType.ATS_Pilotage
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.PILO) {
      return PortcallTimestampType.ATC_Pilotage
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.REQ && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.TOWG) {
      return PortcallTimestampType.RTS_Towage
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.PLN && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.TOWG) {
      return PortcallTimestampType.PTS_Towage
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.TOWG) {
      return PortcallTimestampType.ATS_Towage
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.TOWG) {
      return PortcallTimestampType.ATC_Towage
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.EST && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.BUNK) {
      return PortcallTimestampType.ETS_Bunkering
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && operationEvent.eventClassifierCode == EventClassifierCode.EST && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.BUNK) {
      return PortcallTimestampType.ETC_Bunkering
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.REQ && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.BUNK) {
      return PortcallTimestampType.RTS_Bunkering
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && operationEvent.eventClassifierCode == EventClassifierCode.REQ && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.BUNK) {
      return PortcallTimestampType.RTC_Bunkering
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.PLN && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.BUNK) {
      return PortcallTimestampType.PTS_Bunkering
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.PLN && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.BUNK) {
      return PortcallTimestampType.PTC_Bunkering
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.STRT && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.BUNK) {
      return PortcallTimestampType.ATS_Bunkering
    } /* else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.BUNK) {
      return PortcallTimestampType.EOSP
    } */
    /* else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.BUNK) {
      return PortcallTimestampType.SOSP
    } */ 
    else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.FAST) {
      return PortcallTimestampType.AT_All_Fast
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.GWAY) {
      return PortcallTimestampType.Gangway_Down_and_Safe
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.ARRI && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.SAFE) {
      return PortcallTimestampType.Vessel_Readiness_for_Cargo_Ops
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.DEPA && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.SAFE) {
      return PortcallTimestampType.Terminal_Ready_for_Vessel_Departure
    } else if (operationEvent.operationsEventTypeCode == OperationsEventTypeCode.CMPL && operationEvent.eventClassifierCode == EventClassifierCode.ACT && operationEvent.portCallServiceTypeCode == PortCallServiceTypeCode.LASH) {
      return PortcallTimestampType.ATC_Lashing
    } else {
      return null;
    }

  }
}
