import {Pipe, PipeTransform} from '@angular/core';
import {Port} from "../model/port";

@Pipe({
  name: 'portIdToPort'
})
export class PortIdToPortPipe implements PipeTransform {

  transform(portId: number, portList: Port[]): Port {
    return portList.find(port => port.id === portId);
  }

}
