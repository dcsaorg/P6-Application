import {FacilityCodeType} from "./facilityCodeType";
import {PortCallServiceTypeCode} from "./portCallServiceTypeCode";

export interface TransportCall {
  transportCallID: string;
  transportCallSequenceNumber: number;

  vesselIMONumber: string;
  vesselName: string;

  UNLocationCode: string;

  facilityTypeCode: FacilityCodeType;
  portCallServiceTypeCode: PortCallServiceTypeCode;
  facilityCode: string;
  otherFacility: string;

  facilityCodeListProvider: string; // "SMDG"

  sequenceColor: string;
}
