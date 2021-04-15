import { Pipe, PipeTransform } from '@angular/core';
import {PortcallTimestamp} from "../../model/base/portcall-timestamp";
import {OperationsEvent} from "../../model/OVS/operations-event";
import {DelayCode} from "../../model/base/delayCode";
import {MessageDirection} from "../../model/base/messageDirection";
import {Port} from "../../model/base/port";
import {PortcallTimestampType} from "../../model/base/portcall-timestamp-type.enum";
import {Terminal} from "../../model/base/terminal";
import {Vessel} from "../../model/base/vessel";
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
