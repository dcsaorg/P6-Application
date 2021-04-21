import {FacilityCodeType} from "./facilityCodeType";

export interface TransportCall {
  transportCallID: string;
  vesselIMONumber: string;
  vesselName: string;
  UNLocationCode: string;
  transportCallSequenceNumber: number;
  facilityTypeCode: FacilityCodeType;
  facilityCode: string;
  otherFacility: string;
  sequenceColor: string;

}
