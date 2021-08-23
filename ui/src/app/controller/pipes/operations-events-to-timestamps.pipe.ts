import { Pipe, PipeTransform } from '@angular/core';
import {PortcallTimestamp} from "../../model/portCall/portcall-timestamp";
import {OperationsEvent} from "../../model/ovs/operations-event";
import {DelayCode} from "../../model/portCall/delayCode";
import {MessageDirection} from "../../model/portCall/messageDirection";
import {Port} from "../../model/portCall/port";
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {Terminal} from "../../model/portCall/terminal";
import {Vessel} from "../../model/portCall/vessel";
import {OperationsEventToTimestampTypePipe} from "./operations-event-to-timestamp-type.pipe";
import {OperationsEventToTimestampPipe} from "./operations-event-to-timestamp.pipe";

@Pipe({
  name: 'transportEventsToTimestamps'
})
export class OperationsEventsToTimestampsPipe implements PipeTransform {

  transform(transportEvents: OperationsEvent[]): PortcallTimestamp[] {
    let timestamps: PortcallTimestamp[] = new Array();
     for (let event of transportEvents) {
      timestamps.push(new OperationsEventToTimestampPipe().transform(event));
    }

    return timestamps;
  }



}
