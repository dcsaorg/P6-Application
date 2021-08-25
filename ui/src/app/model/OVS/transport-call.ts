import {PortCallServiceTypeCode} from "../enums/portCallServiceTypeCode";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";

export interface TransportCall {
  carrierServiceCode?: string;
  carrierVoyageNumber?: string;
  transportCallID: string;
  transportCallSequenceNumber: number;

  vesselIMONumber: string;
  vesselName: string;

  UNLocationCode: string;
  transportCallSequenceNumber: number;
  facilityTypeCode: FacilityTypeCode;
  portCallServiceTypeCode: PortCallServiceTypeCode;
  facilityCode: string;
  otherFacility: string;

  facilityCodeListProvider: string; // "SMDG"

  sequenceColor: string;
}
