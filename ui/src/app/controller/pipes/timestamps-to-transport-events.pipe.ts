import { Pipe, PipeTransform } from '@angular/core';
import {PortcallTimestamp} from "../../model/base/portcall-timestamp";
import {TransportEvent} from "../../model/OVS/transport-event";

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

    return transportEvent;
  }



}
