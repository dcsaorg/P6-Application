import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestampType} from "../model/portcall-timestamp-type.enum";

@Pipe({
  name: 'portCallTimestampTypePipe'
})
export class PortCallTimestampTypePipe implements PipeTransform {

  transform(timestampType: PortcallTimestampType, ...args: unknown[]): unknown {
    return PortcallTimestampType[timestampType];
  }

}
