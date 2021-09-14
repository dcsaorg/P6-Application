import {Pipe, PipeTransform} from '@angular/core';
import {Port} from "../../model/portCall/port";
import {PortcallTimestamp} from "../../model/portCall/portcall-timestamp";
import {PortIdToPortPipe} from "./port-id-to-port.pipe";
import {DatePipe} from "@angular/common";


@Pipe({
  name: 'timestampToTimezone'
})
export class TimestampToTimezonePipe implements PipeTransform {

  transform(inputDate: Date, portCallTimestamp: PortcallTimestamp, portlist: Port[]): string[] {
    if (portCallTimestamp.portOfCall) {
      const portId: number = portCallTimestamp.portOfCall.id;
      const timeZone = new PortIdToPortPipe().transform(portId, portlist).timezone;
      let newTime = new DatePipe('en-GB').transform(inputDate, "MM/dd/yyyy HH:mm ZZZZZ", timeZone)
      if (newTime.includes('Z')) {
        return [newTime.slice(0, -2), "00:00"]
      } else if (newTime.includes(' -')) {
        let r = newTime.split(' -');
        return [r[0], "-" + r[1]]
      } else if (newTime.includes(' +')) {
        let t = newTime.split(' +')
        return [t[0], "+" + t[1]]
      }
    }
    return ["N/A", "N/A"];
  }


}
