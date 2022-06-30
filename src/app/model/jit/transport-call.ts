import { PortCallServiceTypeCode } from "../enums/portCallServiceTypeCode";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";
import { FacilityCodeListProvider } from "../enums/facilityCodeListProvider";
import { Vessel } from "../portCall/vessel";
import { Port } from "../portCall/port";
import { EventLocation } from "../eventLocation";

export interface TransportCall {
  carrierServiceCode?: string;
  carrierVoyageNumber?: string;
  exportVoyageNumber?: string;
  importVoyageNumber?: string;
  portOfCall?: Port;
  transportCallReference: string;
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
  vessel?: Vessel;
  location: EventLocation;
  etaBerthDateTime?: Date;
  atdBerthDateTime?: Date;
  latestEventCreatedDateTime?: Date;
  transportCallID: string;
}
