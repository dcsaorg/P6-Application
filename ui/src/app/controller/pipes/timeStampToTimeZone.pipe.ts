import {Pipe, PipeTransform} from '@angular/core';
import {Port} from "../../model/portCall/port";
import {PortIdToPortPipe} from "./port-id-to-port.pipe";
import { MomentDatePipe } from './moment-date-pipe';
import { Globals } from 'src/app/model/portCall/globals';


@Pipe({
  name: 'timestampToTimezone'
})
export class TimestampToTimezonePipe implements PipeTransform {

  constructor(private globals: Globals) {
  }

  transform(inputDate: Date, portOfCall: Port, portlist: Port[]): string[] {
    if (portOfCall && inputDate){
      const portId: number = portOfCall.id;
      const timeZone = new PortIdToPortPipe().transform(portId, portlist).timezone;
      const pipe = new MomentDatePipe('en-GB');
      let newTime = pipe.transform(inputDate, this.globals.config.dateTimeFormat, timeZone)
      let newTimeTZ = pipe.transform(inputDate, 'ZZZZZ', timeZone);
      if (newTimeTZ == 'Z') {
        newTimeTZ = '00:00';
      }
      return [newTime, newTimeTZ]
    }
    return ["N/A","N/A"];
  }
}
