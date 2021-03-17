import {PortcallTimestampType} from "./portcall-timestamp-type.enum";
import {Port} from "./port";
import {Terminal} from "./terminal";
import {DelayCode} from "./delayCode";
import {Vessel} from "./vessel";
import {MessageDirection} from "./messageDirection";

export interface PortcallTimestamp {
  id: string;
  timestampType: PortcallTimestampType;
  classifierCode: string;
  eventTypeCode: string;
  locationType: string;
  callSequence?: number;
  logOfTimestamp: string | Date;
  eventTimestamp: string | Date;
  portPrevious: Port | number;
  portOfCall: Port | number;
  portNext: Port | number;
  direction: string;
  terminal: Terminal | number;
  locationId: string;
  changeComment?: string;
  delayCode?: DelayCode | string;
  vessel: number | Vessel;
  response?: PortcallTimestampType;
  modifiable: boolean;
  messageDirection?: MessageDirection;
  transportCallID?: string;
  messagingStatus?: string;
  messagingDetails?: string;
  outdatedMessage?: boolean;
  uiReadByUser?:boolean;
  sequenceColor?: string;

}
