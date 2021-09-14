import {Pipe, PipeTransform} from '@angular/core';
import {Port} from "../../model/portCall/port";
import {PortIdToPortPipe} from "./port-id-to-port.pipe";
import { MomentDatePipe } from './moment-date-pipe';


@Pipe({
  name: 'timestampToTimezone'
})
export class TimestampToTimezonePipe implements PipeTransform {

  transform(inputDate: Date, portOfCall: Port, portlist: Port[]): string[] {
    if(portOfCall && inputDate){
    const portId: number = portOfCall.id;
    const timeZone = new PortIdToPortPipe().transform(portId, portlist).timezone;
    let newTime = new MomentDatePipe('en-GB').transform(inputDate, "MM/dd/yyyy HH:mm ZZZZZ", timeZone)
    if (newTime.includes('Z')){
      return [newTime.slice(0,-2),"00:00"]
    }
    else if(newTime.includes(' -')){
      let r = newTime.split(' -'); 
      return [r[0],"-"+ r[1]]
    }
     else if(newTime.includes(' +')){
       let t = newTime.split(' +')
       return[t[0], "+"+ t[1]]
     }
  }
  return ["N/A","N/A"]; 
  }



}
