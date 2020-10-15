import {PortcallTimestampType} from "./portcall-timestamp-type.enum";
import {Port} from "./port";

export interface PortcallTimestamp {
  timestampType: PortcallTimestampType;
  classifierCode: string;
  eventTypeCode: string;
  logOfCall: string;
  eventTimestamp: string;
  portFrom: Port;
  portApproach: Port;
  portNext: Port;
  direction: string;
  terminalId: string;
  locationId: string;
}
