import {EventType} from "./eventType";
import {EventClassifierCode} from "./eventClassifierCode";
import {FacilityCodeType} from "./facilityCodeType";
import {OperationsEventTypeCode} from "./operationsEventTypeCode";
import {PartyFunction} from "./partyFunction";
import {PortCallServiceTypeCode} from "./portCallServiceTypeCode";

export interface OperationsEvent {
  eventID: string;
  eventType: EventType;
  eventDateTime: string | Date;
  eventClassifierCode: EventClassifierCode;
  operationsEventTypeCode: OperationsEventTypeCode;
  eventCreatedDateTime: string | Date;
  transportCallID: string;
  facilityTypeCode: FacilityCodeType;
  publisher: string;
  portCallServiceTypeCode: PortCallServiceTypeCode;
  publisherRole: PartyFunction
  eventLocation: string;
  changeRemark: string;
  delayReasonCode: string;
}