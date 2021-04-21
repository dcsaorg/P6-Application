import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";

@Pipe({
  name: 'portCallTimestampTypeToStringPipe'
})
export class PortCallTimestampTypeToStringPipe implements PipeTransform {

  transform(timestampType: PortcallTimestampType, ...args: unknown[]): string {
    return PortcallTimestampType[timestampType];
  }
}
