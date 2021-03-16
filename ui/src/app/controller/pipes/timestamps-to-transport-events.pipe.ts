import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestamp} from "../../model/base/portcall-timestamp";
import {TransportEvent} from "../../model/OVS/transport-event";
import {PortcallTimestampType} from "../../model/base/portcall-timestamp-type.enum";
import {TimestampTypeToEventClassifierCodePipe} from "./timestamp-type-to-event-classifier-code.pipe";
import {TimestampTypeToEventTypePipe} from "./timestamp-type-to-event-type.pipe";
import {TimestampTypeToLocationTypePipe} from "./timestamp-type-to-location-type.pipe";

@Pipe({
  name: 'timestampsToTransportEvents'
})
export class TimestampsToTransportEventsPipe implements PipeTransform {

  transform(portcallTimestamp: PortcallTimestamp): TransportEvent {
    let transportEvent: TransportEvent = new class implements TransportEvent {
      comment: string;
      creationDateTime: string | Date;
      delayReasonCode: string;
      eventClassifierCode: string;
      eventDateTime: string | Date;
      eventID: string;
      eventType: string;
      eventTypeCode: string;
      locationID: string;
      locationType: string;
      transportCallID: string;
    }

    transportEvent.creationDateTime = portcallTimestamp.logOfTimestamp;
    transportEvent.eventDateTime = portcallTimestamp.eventTimestamp;
    transportEvent.locationID = portcallTimestamp.locationId;
    transportEvent.comment = portcallTimestamp.changeComment;
    transportEvent.delayReasonCode = "";
    transportEvent.eventClassifierCode = new TimestampTypeToEventClassifierCodePipe().transform(PortcallTimestampType[portcallTimestamp.timestampType]);
    transportEvent.eventTypeCode = new TimestampTypeToEventTypePipe().transform(PortcallTimestampType[portcallTimestamp.timestampType])
    transportEvent.locationType = new TimestampTypeToLocationTypePipe().transform(PortcallTimestampType[portcallTimestamp.timestampType])
    transportEvent.transportCallID = portcallTimestamp.transportCallID;
    transportEvent.eventType = "TRANSPORT";

    return transportEvent;
  }



}
