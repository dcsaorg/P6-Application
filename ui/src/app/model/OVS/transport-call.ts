import {FacilityCodeType} from "./facilityCodeType";
import {Vessel} from "./vessel";

export interface TransportCall {
  transportCallID: string;
  vessel: Vessel;
  UNLocationCode: string;
  transportCallSequenceNumber: number;
  facilityTypeCode: FacilityCodeType;
  facilityCode: string;
  otherFacility: string;
  sequenceColor: string;

}
