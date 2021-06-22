import {FacilityCodeType} from "./facilityCodeType";

export interface TransportCallWank {
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
