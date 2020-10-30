import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateToUtc'
})
export class DateToUtcPipe implements PipeTransform {

  transform(localDate: Date | string): Date | string {

    if (typeof localDate === "string") {
      return localDate
    } else {
      console.log(localDate.getDate());
      return new Date(Date.UTC(localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        localDate.getHours(),
        localDate.getMinutes(),
        localDate.getSeconds()));
    }
  }

}
