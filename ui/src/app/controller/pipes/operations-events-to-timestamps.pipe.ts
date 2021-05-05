import { Pipe, PipeTransform } from '@angular/core';
import {PortcallTimestamp} from "../../model/portCall/portcall-timestamp";
import {OperationsEvent} from "../../model/OVS/operations-event";
import {OperationsEventToTimestampPipe} from "./operations-event-to-timestamp.pipe";
import {Globals} from "../../model/portCall/globals";

@Pipe({
  name: 'transportEventsToTimestamps'
})
export class OperationsEventsToTimestampsPipe implements PipeTransform {

  constructor(private globals:Globals) {
  }

  transform(transportEvents: OperationsEvent[]): PortcallTimestamp[] {
    let timestamps: PortcallTimestamp[] = new Array();
     for (let event of transportEvents) {
      timestamps.push(new OperationsEventToTimestampPipe(this.globals).transform(event));
    }

    return timestamps;
  }



}
