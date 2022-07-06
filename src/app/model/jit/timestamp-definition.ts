import { OperationsEventTypeCode } from '../enums/operationsEventTypeCode';
import { PublisherRole } from '../enums/publisherRole';
import {EventClassifierCode} from "./eventClassifierCode";
import {PortCallPhaseTypeCode} from "../enums/portCallPhaseTypeCode";
import {PortCallServiceTypeCode} from "../enums/portCallServiceTypeCode";
import {FacilityTypeCode} from "../enums/facilityTypeCodeOPR";

export interface timestampDefinitionTO {
  id: string;
  timestampTypeName: string;
  publisherRole: PublisherRole;
  primaryReceiver: PublisherRole;
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

  acceptTimestampDefinition: string;
  acceptTimestampDefinitionEntity?: timestampDefinitionTO;
  rejectTimestampDefinition: string;
  rejectTimestampDefinitionEntity?: timestampDefinitionTO;
}
