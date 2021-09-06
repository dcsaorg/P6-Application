import {PortCallServiceTypeCode} from "../enums/portCallServiceTypeCode";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";
import {FacilityCodeListProvider} from "../Enums/facilityCodeListProvider";
import {Vessel} from "../portCall/vessel";

export interface TransportCall {
  carrierServiceCode?: string;
  carrierVoyageNumber?: string;
  transportCallID: string;
  modeOfTransport: string;
  vesselIMONumber: string;
  vesselName: string;
  UNLocationCode: string;
  transportCallSequenceNumber: number;
  facilityTypeCode: FacilityTypeCode;
  facilityCodeListProvider: FacilityCodeListProvider;
  portCallServiceTypeCode: PortCallServiceTypeCode;
  facilityCode: string;
  otherFacility: string;
  sequenceColor: string;
  vessel: Vessel;
  estimatedDateofArrival?: string | Date;

}
