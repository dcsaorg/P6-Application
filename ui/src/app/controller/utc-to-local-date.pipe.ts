import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'utcToLocalDate'
})
export class UtcToLocalDatePipe implements PipeTransform {

  transform(utcDate: Date | string, ...args: unknown[]): Date | string {
    if (typeof utcDate === "string") {
      return utcDate
    } else {
      const time = "Locale ="+utcDate.getHours()+ "utc 0 "+utcDate.getUTCHours();
      console.log(time)
      return new Date(utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDay(),
        utcDate.getUTCHours(),
        utcDate.getUTCMinutes(),
        utcDate.getUTCSeconds());
    }
  }

}
