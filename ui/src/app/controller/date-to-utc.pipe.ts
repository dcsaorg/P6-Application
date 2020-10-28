import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateToUtc'
})
export class DateToUtcPipe implements PipeTransform {

  transform(localDate: Date | string, ...args: unknown[]): Date | string {

    if (typeof localDate === "string") {
      return localDate
    } else {

      return new Date(Date.UTC(localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDay(),
        localDate.getHours(),
        localDate.getMinutes(),
        localDate.getSeconds()));
    }
  }

}
