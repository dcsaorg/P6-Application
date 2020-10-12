import {PortcallTimestampType} from "./portcall-timestamp-type.enum";
import {PortcallClassifierCode} from "./portcall-classifier-code.enum";
import {PortcallEventTypeCode} from "./portcall-event-type-code.enum";
import {PortcallLocationTypeCode} from "./portcall-location-type-code.enum";

export interface PortcallTimestamp {
  timestampType: PortcallTimestampType;
  classifierCode: PortcallClassifierCode;
  eventTypeCode: PortcallEventTypeCode;
  eventLocationCode: PortcallLocationTypeCode;
  communicationTimestamp: string;
  eventTimestamp: string;
  portFrom:string;
  portTo:string;
  nextPort:string
  direction:string
  terminalId:string
  locationId:string


}

