import {PortcallTimestampType} from "./portcall-timestamp-type.enum";
import {Port} from "./port";
import {Terminal} from "./terminal";

export interface PortcallTimestamp {
  timestampType: PortcallTimestampType | string;
  classifierCode: string;
  eventTypeCode: string;
  logOfTimestamp: string | Date;
  eventTimestamp: string | Date;
  portPrevious: Port | number;
  portOfCall: Port | number;
  portNext: Port | number;
  direction: string;
  terminal: Terminal | number;
  locationId: string;
}
