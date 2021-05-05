import { Pipe, PipeTransform } from '@angular/core';
import {Port} from "../../model/portCall/port";
import {Globals} from "../../model/portCall/globals";

@Pipe({
  name: 'unlocodeToPort'
})
export class UnlocodeToPortPipe implements PipeTransform {

  constructor(private globals: Globals,) {
  }

  transform(UNLOCODE: String): Port {
    for (let port of this.globals.ports) {
      if (port.unLocode == UNLOCODE) {
        return port;
      }
    }
    return null;
  }

}
