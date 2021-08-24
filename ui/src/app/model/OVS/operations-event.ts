import {EventType} from "./eventType";
import {EventClassifierCode} from "./eventClassifierCode";
import {FacilityCodeType} from "./facilityCodeType";
import {OperationsEventTypeCode} from "./operationsEventTypeCode";
import {PortCallServiceTypeCode} from "../enums/portCallServiceTypeCode";
import {TransportCall} from "./transport-call";
import { PublisherRole } from "../enums/publisherRole";
import { Publisher } from "../publisher";

export interface OperationsEvent {
  eventID: string;
  eventType: EventType;
  eventDateTime: string | Date;
  eventClassifierCode: EventClassifierCode;
  operationsEventTypeCode: OperationsEventTypeCode;
  eventCreatedDateTime: string | Date;
  transportCallID: string;
  transportCall: TransportCall;
  facilityTypeCode: FacilityCodeType;
  publisher: Publisher;
  portCallServiceTypeCode: PortCallServiceTypeCode;
  publisherRole: PublisherRole;
  eventLocation: string;
  changeRemark: string;
  delayReasonCode: string;
}
