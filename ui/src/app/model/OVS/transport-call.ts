import {FacilityCodeType} from "./facilityCodeType";
import {PortCallServiceTypeCode} from "./portCallServiceTypeCode";

export interface TransportCall {
  transportCallID: string;
  vesselIMONumber: string;
  vesselName: string;
  UNLocationCode: string;
  transportCallSequenceNumber: number;
  facilityTypeCode: FacilityCodeType;
  portCallServiceTypeCode: PortCallServiceTypeCode;
  facilityCode: string;
  otherFacility: string;
  sequenceColor: string;

}
