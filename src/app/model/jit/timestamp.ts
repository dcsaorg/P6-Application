import { Publisher } from "../publisher";
import { PublisherRole } from "../enums/publisherRole";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";
import { OperationsEventTypeCode } from "../enums/operationsEventTypeCode";
import { EventLocation } from "../eventLocation";
import { VesselPosition } from "../vesselPosition";
import { ModeOfTransport } from "../enums/modeOfTransport";
import { PortCallServiceTypeCode } from "../enums/portCallServiceTypeCode";
import { EventClassifierCode } from "./event-classifier-code";
import { NegotiationCycle } from "../portCall/negotiation-cycle";
import { TimestampDefinitionTO } from "./timestamp-definition";
import { PortCallPhaseTypeCode } from "../enums/portCallPhaseTypeCode";
import {TimestampVessel, Vessel} from "../portCall/vessel";

export interface Timestamp {
  publisher: Publisher;
  publisherRole: PublisherRole;
  UNLocationCode: string;
  facilityTypeCode: FacilityTypeCode;
  eventClassifierCode: EventClassifierCode;
  operationsEventTypeCode: OperationsEventTypeCode;
  eventLocation?: EventLocation;
  vesselPosition?: VesselPosition;
  portCallPhaseTypeCode?: PortCallPhaseTypeCode;
  portCallServiceTypeCode?: PortCallServiceTypeCode;
  eventDateTime: Date | string;
  carrierServiceCode?: string;
  remark?: string;
  delayReasonCode?: string;
  timestampDefinitionTO?: TimestampDefinitionTO;
  carrierExportVoyageNumber?: string;
  carrierImportVoyageNumber?: string;
  vessel?: TimestampVessel | null;
  portVisitReference?: string;
  milesToDestinationPort?: number;
  transportCallSequenceNumber?: number;

  /**
* @deprecated
*/
  modeOfTransport?: ModeOfTransport;
  /**
  * @deprecated
  */
  carrierVoyageNumber: string;

  /**
* @deprecated
*/
  importVoyageNumber?: string;
  /**
* @deprecated
*/
  exportVoyageNumber?: string;

  /**
* @deprecated
*/
  vesselIMONumber: string;
  /**
* @deprecated
*/
  facilitySMDGCode?: string;

}
