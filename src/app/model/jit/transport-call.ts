import { PortCallServiceTypeCode } from "../enums/portCallServiceTypeCode";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";
import { FacilityCodeListProvider } from "../enums/facilityCodeListProvider";
import { Vessel } from "../portCall/vessel";
import { Port } from "../portCall/port";
import { EventLocation } from "../eventLocation";

export interface TransportCall {
  carrierServiceCode?: string;
  carrierVoyageNumber?: string;
  portVisitReference?: string;
  carrierExportVoyageNumber?: string;
  carrierImportVoyageNumber?: string;
  portOfCall?: Port;
  transportCallReference: string;
  modeOfTransport: string;
  UNLocationCode: string;
  transportCallSequenceNumber: number;
  facilityTypeCode: FacilityTypeCode;
  facilityCodeListProvider: FacilityCodeListProvider;
  facilityCode: string;
  otherFacility: string;
  sequenceColor?: string;
  vessel?: Vessel;
  location: EventLocation;
  etaBerthDateTime?: Date;
  atdBerthDateTime?: Date;
  omitCreatedDateTime?: Date;
  latestEventCreatedDateTime?: Date;
  transportCallID: string | null;
    /**
* @deprecated
Although deprecated, the UI JIT 1.1 combo - newer fields are converted to this
*/
  exportVoyageNumber?: string;
    /**
* @deprecated
Although deprecated, the UI uses JIT 1.1 combo  - newer fields are convereted to this
*/
  importVoyageNumber?: string;
}
