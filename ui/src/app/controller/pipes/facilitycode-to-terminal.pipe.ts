import { Pipe, PipeTransform } from '@angular/core';
import {Terminal} from "../../model/portCall/terminal";
import {Globals} from "../../model/portCall/globals";

@Pipe({
  name: 'facilitycodeToTerminal'
})


export class FacilitycodeToTerminalPipe implements PipeTransform {


  constructor(private globals: Globals,) {
  }


  transform(facilityCode: String): Terminal {
    if (facilityCode.length > 5) {
      const smdgCode = facilityCode.substring(5, facilityCode.length);
      for (let terminal of this.globals.terminals) {
        if (terminal.smdgCode == smdgCode) {
          return terminal
        }
      }
    }
  }

}
