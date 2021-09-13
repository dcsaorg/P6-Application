import { Pipe, PipeTransform } from '@angular/core';
import {OperationsEvent} from "../../model/ovs/operations-event";
import {OperationsEventToTimestampPipe} from "./operations-event-to-timestamp.pipe";
import { Timestamp } from 'src/app/model/ovs/timestamp';

@Pipe({
  name: 'transportEventsToTimestamps'
})
export class OperationsEventsToTimestampsPipe implements PipeTransform {

  transform(operationsEvent: OperationsEvent[]): Timestamp[] {
    let timestamps: Timestamp[] = new Array();
    for (let event of operationsEvent) {
       
      timestamps.push(new OperationsEventToTimestampPipe().transform(event));
    }

    return timestamps;
  }



}
