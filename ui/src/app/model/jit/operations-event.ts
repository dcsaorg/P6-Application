import {EventType} from "./eventType";
import {EventClassifierCode} from "./eventClassifierCode";
import {OperationsEventTypeCode} from "../enums/operationsEventTypeCode";
import {PortCallServiceTypeCode} from "../enums/portCallServiceTypeCode";
import {TransportCall} from "./transport-call";
import { PublisherRole } from "../enums/publisherRole";
import { Publisher } from "../publisher";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";
import { EventLocation } from "../eventLocation";

export interface OperationsEvent {
  eventID?: string;
  eventType: EventType;
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

}