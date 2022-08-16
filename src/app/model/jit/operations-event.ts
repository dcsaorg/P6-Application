import {EventClassifierCode} from "./event-classifier-code";
import {OperationsEventTypeCode} from "../enums/operationsEventTypeCode";
import {PortCallServiceTypeCode} from "../enums/portCallServiceTypeCode";
import {TransportCall} from "./transport-call";
import { PublisherRole } from "../enums/publisherRole";
import { Publisher } from "../publisher";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";
import { EventLocation } from "../eventLocation";
import { VesselPosition } from "../vesselPosition";
import { PortCallPhaseTypeCode } from "../enums/portCallPhaseTypeCode";
import { DraftUnit } from "../enums/draftUnit";

export interface OperationsEvent {
  eventID?: string;
  eventDateTime: Date;
  eventClassifierCode: EventClassifierCode;
  operationsEventTypeCode: OperationsEventTypeCode;
  eventCreatedDateTime: string | Date;
  transportCallID: string;
  transportCall: TransportCall;
  facilityTypeCode: FacilityTypeCode;
  UNLocationCode: string;
  publisher: Publisher;
  portCallServiceTypeCode: PortCallServiceTypeCode;
  publisherRole: PublisherRole;
  eventLocation?: EventLocation;
  remark?: string;
  delayReasonCode?: string;
  eventDeliveryStatus: string;
  timestampDefinitionID?: string;
  facilityCode: string;
  vesselPosition?: VesselPosition;
  portCallPhaseTypeCode?: PortCallPhaseTypeCode;
  milesToDestinationPort: number;
  vesselDraft: number;
  vesselDraftUnit: DraftUnit;

}
