import {Schedule} from "./schedule";
import {FacilityCodeType} from "./facilityCodeType";

export interface TransportCall {
  transportCallID: string;
  scheduleID: Schedule | string;
  carrierServiceCode: string;
  vesselIMONumber: string;
  vesselName: string;
  carrierVoyageNumber: string;
  UNLocationCode: string;
  transportCallNumber: number;
  facilityTypeCode: FacilityCodeType;
  facilityCode: string;
  otherFacility: string;
  sequenceColor: string;

}
