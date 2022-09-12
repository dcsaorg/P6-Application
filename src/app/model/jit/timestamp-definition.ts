import { OperationsEventTypeCode } from '../enums/operationsEventTypeCode';
import { EventClassifierCode } from "./event-classifier-code";
import { PortCallPhaseTypeCode } from "../enums/portCallPhaseTypeCode";
import { PortCallServiceTypeCode } from "../enums/portCallServiceTypeCode";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";
import { PublisherPattern } from './publisher-pattern';
import { EventLocationRequirement } from '../enums/eventLocationRequirement';
import {NegotiationCycle} from "../portCall/negotiation-cycle";

export interface TimestampDefinitionTO {
  id: string;
  timestampTypeName: string;
  eventClassifierCode: EventClassifierCode;
  operationsEventTypeCode: OperationsEventTypeCode;
  portCallPhaseTypeCode: PortCallPhaseTypeCode;
  portCallServiceTypeCode: PortCallServiceTypeCode;
  portCallPart?: string;
  facilityTypeCode: FacilityTypeCode;
  isBerthLocationNeeded: boolean;
  isPBPLocationNeeded: boolean;
  isTerminalNeeded: boolean;
  vesselPositionRequirement: EventLocationRequirement;
  isMilesToDestinationRelevant: boolean;
  providedInStandard: string;
  publisherPattern: Array<PublisherPattern>;
  acceptTimestampDefinition: string;
  acceptTimestampDefinitionEntity?: TimestampDefinitionTO;
  rejectTimestampDefinition: string;
  rejectTimestampDefinitionEntity?: TimestampDefinitionTO;
  eventLocationRequirement: EventLocationRequirement;
  negotiationCycle: NegotiationCycle;
  implicitVariantOf: string;
}
