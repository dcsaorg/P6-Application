import {EventType} from "./eventType";
import {EventClassifierCode} from "./eventClassifierCode";
import {OperationsEventTypeCode} from "./operationsEventTypeCode";
import {PortCallServiceTypeCode} from "../enums/portCallServiceTypeCode";
import {TransportCall} from "./transport-call";
import { PublisherRole } from "../enums/publisherRole";
import { Publisher } from "../publisher";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";

export interface OperationsEvent {
  eventID?: string;
  eventType: EventType;
  eventDateTime: string | Date;
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
  eventLocation: string;
  remark?: string;
  delayReasonCode?: string;
  eventDeliveryStatus: string;
}
