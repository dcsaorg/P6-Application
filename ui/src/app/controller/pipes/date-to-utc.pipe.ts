import {Pipe, PipeTransform} from '@angular/core';
import {Port} from "../../model/portCall/port";
import moment from "moment";

@Pipe({
  name: 'dateToUtc'
})
export class DateToUtcPipe implements PipeTransform {

  transform(localDate: Date, localTime: string, port: Port): Date {
    let year = localDate.getFullYear();
    let month = String((localDate.getMonth() + 1)).padStart(2, '0');
    let day = String(localDate.getDate()).padStart(2, '0');
    let [hour, minute] = localTime.split(':');
    let second = String(localDate.getSeconds()).padStart(2, '0');
    // For whatever reason, this only works when passing date as string instead of a Date object
    let newDate = moment.tz(`${year}-${month}-${day} ${hour}:${minute}:${second}`, port.timezone).toISOString()
    return new Date(newDate);
  }
}
