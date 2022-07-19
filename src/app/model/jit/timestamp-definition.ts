import { OperationsEventTypeCode } from '../enums/operationsEventTypeCode';
import { PublisherRole } from '../enums/publisherRole';
import { EventClassifierCode } from "./eventClassifierCode";
import { PortCallPhaseTypeCode } from "../enums/portCallPhaseTypeCode";
import { PortCallServiceTypeCode } from "../enums/portCallServiceTypeCode";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";
import { PublisherPattern } from './publisher-pattern';

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
  isVesselPositionNeeded: boolean;
  negotiationCycle: string;
  providedInStandard: string;
  publisherPattern: Array<PublisherPattern>;
  acceptTimestampDefinition: string;
  acceptTimestampDefinitionEntity?: TimestampDefinitionTO;
  rejectTimestampDefinition: string;
  rejectTimestampDefinitionEntity?: TimestampDefinitionTO;


  /**
* @deprecated

detected through publisherPattern field & then set by mapping 
*/
  publisherRole: PublisherRole;
  /**
* @deprecated
detected through publisherPattern field & then set by mapping
*/
  primaryReceiver: PublisherRole;

}
