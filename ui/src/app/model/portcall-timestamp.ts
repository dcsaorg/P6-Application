import {PortcallTimestampType} from "./portcall-timestamp-type.enum";
import {Port} from "./port";

export interface PortcallTimestamp {
  timestampType: PortcallTimestampType;
  classifierCode: string;
  eventTypeCode: string;
  logOfTimestamp: string;
  eventTimestamp: string;
  portFrom: Port;
  portOfCall: Port;
  portNext: Port;
  direction: string;
  terminalId: string;
  locationId: string;
}
