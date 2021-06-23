import {FacilityCodeType} from "./facilityCodeType";

export interface TransportCall {
  transportCallID: string;
  transportCallSequenceNumber: number;

  vesselIMONumber: string;
  vesselName: string;

  UNLocationCode: string;

  facilityTypeCode: FacilityCodeType;
  facilityCode: string;
  otherFacility: string;

  facilityCodeListProvider: string; // "SMDG"

  sequenceColor: string;
}
