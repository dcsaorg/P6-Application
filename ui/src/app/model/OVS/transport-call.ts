import {PortCallServiceTypeCode} from "../enums/portCallServiceTypeCode";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";

export interface TransportCall {
  transportCallID: string;
  vesselIMONumber: string;
  vesselName: string;
  UNLocationCode: string;
  transportCallSequenceNumber: number;
  facilityTypeCode: FacilityTypeCode;
  portCallServiceTypeCode: PortCallServiceTypeCode;
  facilityCode: string;
  otherFacility: string;
  sequenceColor: string;

}
