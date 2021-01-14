import {Pipe, PipeTransform} from '@angular/core';
import {Terminal} from "../../model/terminal";

@Pipe({
  name: 'terminalIdToTerminal'
})
export class TerminalIdToTerminalPipe implements PipeTransform {

  transform(terminalID: number, terminallist:Terminal[]): Terminal {
    return terminallist.find(terminal => terminalID === terminal.id);
  }

}
