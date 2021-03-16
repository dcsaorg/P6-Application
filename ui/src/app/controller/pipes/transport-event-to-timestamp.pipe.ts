import { Pipe, PipeTransform } from '@angular/core';
import {TransportEvent} from "../../model/OVS/transport-event";
import {PortcallTimestamp} from "../../model/base/portcall-timestamp";
import {DelayCode} from "../../model/base/delayCode";
import {MessageDirection} from "../../model/base/messageDirection";
import {Port} from "../../model/base/port";
import {PortcallTimestampType} from "../../model/base/portcall-timestamp-type.enum";
import {Terminal} from "../../model/base/terminal";
import {Vessel} from "../../model/base/vessel";
import {TransportEventToTimestampTypePipe} from "./transport-event-to-timestamp-type.pipe";

@Pipe({
  name: 'transportEventToTimestamp'
})
export class TransportEventToTimestampPipe implements PipeTransform {

  transform(transportEvent: TransportEvent): PortcallTimestamp {
    let timestamp: PortcallTimestamp;
    timestamp = new class implements PortcallTimestamp {
      callSequence: number;
      changeComment: string;
      classifierCode: string;
      delayCode: DelayCode | number;
      direction: string;
      eventTimestamp: string | Date;
      eventTypeCode: string;
      id: string;
      locationId: string;
      logOfTimestamp: string | Date;
      messageDirection: MessageDirection;
      messagingDetails: string;
      messagingStatus: string;
      modifiable: boolean;
      outdatedMessage: boolean;
      portNext: Port | number;
      portOfCall: Port | number;
      portPrevious: Port | number;
      response: PortcallTimestampType;
      sequenceColor: string;
      terminal: Terminal | number;
      timestampType: PortcallTimestampType | string;
      transportCallID: string;
      uiReadByUser: boolean;
      vessel: number | Vessel;
    };

    timestamp.id = transportEvent.eventID;
    timestamp.timestampType = this.getTimestampType(transportEvent);
    timestamp.classifierCode = transportEvent.eventClassifierCode;
    timestamp.eventTimestamp = transportEvent.eventTypeCode;
    timestamp.callSequence = 0;
    timestamp.logOfTimestamp = transportEvent.creationDateTime;
    timestamp.eventTimestamp = transportEvent.eventDateTime;
    timestamp.changeComment = transportEvent.comment;
    timestamp.transportCallID = transportEvent.transportCallID;
    timestamp.locationId = transportEvent.locationID;
    timestamp.uiReadByUser = true;


    return timestamp;


  }

  private getTimestampType(transportEvent: TransportEvent):PortcallTimestampType{
    const timestampTypeMapping: TransportEventToTimestampTypePipe = new TransportEventToTimestampTypePipe();
    return timestampTypeMapping.transform(transportEvent);
  }

}
