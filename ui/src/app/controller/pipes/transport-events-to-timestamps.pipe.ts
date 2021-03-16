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
import {TransportEventToTimestampPipe} from "./transport-event-to-timestamp.pipe";

@Pipe({
  name: 'transportEventsToTimestamps'
})
export class TransportEventsToTimestampsPipe implements PipeTransform {

  transform(transportEvents: TransportEvent[]): PortcallTimestamp[] {
    let timestamps: PortcallTimestamp[] = new Array();
     for (let event of transportEvents) {
      timestamps.push(new TransportEventToTimestampPipe().transform(event));
    }

    return timestamps;
  }



}
