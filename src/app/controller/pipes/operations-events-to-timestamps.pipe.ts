import { Pipe, PipeTransform } from '@angular/core';
import {OperationsEvent} from "../../model/jit/operations-event";
import {OperationsEventToTimestampPipe} from "./operations-event-to-timestamp.pipe";
import { Timestamp } from 'src/app/model/jit/timestamp';
import {timestampDefinitionTO} from "../../model/jit/timestamp-definition";

@Pipe({
  name: 'transportEventsToTimestamps'
})
export class OperationsEventsToTimestampsPipe implements PipeTransform {

  transform(operationsEvent: OperationsEvent[], timestampDefinitions: Map<string, timestampDefinitionTO>): Timestamp[] {
    let timestamps: Timestamp[] = [];
    const pipe = new OperationsEventToTimestampPipe();
    for (let event of operationsEvent) {

      timestamps.push(pipe.transform(event, timestampDefinitions));
    }

    return timestamps;
  }



}
