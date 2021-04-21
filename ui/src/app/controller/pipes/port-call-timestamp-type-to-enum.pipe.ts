import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";

@Pipe({
  name: 'portCallTimestampTypeToEnumPipe'
})
export class PortCallTimestampTypeToEnumPipe implements PipeTransform {

  transform(timestampTypeString: string, ...args: unknown[]): PortcallTimestampType {
    return PortcallTimestampType[timestampTypeString];
  }
}
