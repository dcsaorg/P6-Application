import {PortcallTimestampType} from "./portcall-timestamp-type.enum";
import {Port} from "./port";
import {Terminal} from "./terminal";
import {DelayCode} from "./delayCode";

export interface PortcallTimestamp {
  id: number;
  timestampType: PortcallTimestampType | string;
  classifierCode: string;
  eventTypeCode: string;
  callSequence: number;
  logOfTimestamp: string | Date;
  eventTimestamp: string | Date;
  portPrevious: Port | number;
  portOfCall: Port | number;
  portNext: Port | number;
  direction: string;
  terminal: Terminal | number;
  locationId: string;
  changeComment?: string;
  delayCode?: DelayCode | number;
}
