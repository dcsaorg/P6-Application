import {Pipe, PipeTransform} from '@angular/core';
import {Port} from "../../model/port";

@Pipe({
  name: 'portIdToPort'
})
export class PortIdToPortPipe implements PipeTransform {

  transform(portId: number, portList: Port[]): Port {
    const portNotThere: Port = {
      id: portId,
      name: '',
      unLocode: '',
      timezone: '',
      unCountry: '',
      unLocation: ''
    }
    const findPort = portList.find(port => port.id === portId);
    return findPort ? findPort : portNotThere;
  }

}
