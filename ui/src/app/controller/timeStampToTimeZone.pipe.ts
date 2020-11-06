import { Pipe, PipeTransform } from '@angular/core';
import {Port} from "../model/port";
import {PortcallTimestamp} from "../model/portcall-timestamp";
import {PortIdToPortPipe} from "./port-id-to-port.pipe";
import {toNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";
import {timestamp} from "rxjs/operators";
import {DatePipe} from "@angular/common";


@Pipe({
  name: 'timestampToTimezone'
})
export class TimestampToTimezonePipe implements PipeTransform {

  transform(inputDate :Date, portCallTimestamp: PortcallTimestamp, portlist : Port[]): string {
    const portId: number = (typeof portCallTimestamp.portOfCall === "number"?portCallTimestamp.portOfCall:portCallTimestamp.portOfCall.id);
    const timeZone = new PortIdToPortPipe().transform(portId, portlist).timezone;
    return new DatePipe('en-GB').transform(inputDate, "MM/dd/yyyy HH:mm", timeZone);
  }

}