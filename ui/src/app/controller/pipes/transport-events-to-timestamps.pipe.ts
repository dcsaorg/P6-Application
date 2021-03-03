import { Pipe, PipeTransform } from '@angular/core';
import {PortcallTimestamp} from "../../model/base/portcall-timestamp";
import {TransportEvent} from "../../model/OVS/transport-event";
import {DelayCode} from "../../model/base/delayCode";
import {MessageDirection} from "../../model/base/messageDirection";
import {Port} from "../../model/base/port";
import {PortcallTimestampType} from "../../model/base/portcall-timestamp-type.enum";
import {Terminal} from "../../model/base/terminal";
import {Vessel} from "../../model/base/vessel";
import {TransportEventToTimestampTypePipe} from "./transport-event-to-timestamp-type.pipe";

@Pipe({
  name: 'transportEventsToTimestamps'
})
export class TransportEventsToTimestampsPipe implements PipeTransform {

  transform(transportEvents: TransportEvent[]): PortcallTimestamp[] {
    let timestamps: PortcallTimestamp[] = new Array();
     for (let event of transportEvents) {
      timestamps.push(this.mapTtansportEventToTimestamp(event));

    }

    return timestamps;
  }

  //This function maps a single transportEvent to a base timestamp
  private mapTtansportEventToTimestamp(event: TransportEvent): PortcallTimestamp {
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

    timestamp.id = event.eventID;
    timestamp.timestampType = this.getTimestampType(event);
    timestamp.classifierCode = event.eventClassifierCode;
    timestamp.eventTimestamp = event.eventTypeCode;
    timestamp.callSequence = 0;
    timestamp.logOfTimestamp = event.creationDateTime;
    timestamp.eventTimestamp = event.eventDateTime;
    timestamp.changeComment = event.comment;
    timestamp.transportCallID = event.transportCallID;
    timestamp.locationId = event.locationID;
    timestamp.uiReadByUser = true;


    return timestamp;


  }

  private getTimestampType(transportEvent: TransportEvent):PortcallTimestampType{
   const timestampTypeMapping: TransportEventToTimestampTypePipe = new TransportEventToTimestampTypePipe();
   return timestampTypeMapping.transform(transportEvent);
  }

}
