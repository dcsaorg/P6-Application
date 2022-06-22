import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import moment from 'moment-timezone'


/*** A moment timezone pipe to support parsing based on time zone abbreviations
 * covers all cases of offset variation due to daylight saving.
 *
 * Same API as DatePipe with additional timezone abbreviation support
 * Official date pipe dropped support for abbreviations names from Angular V5
 */

@Pipe({ name: 'momentDate' })
export class MomentDatePipe extends DatePipe implements PipeTransform {
  transform(value: Date | string | number, format?: string, timezone?: string, locale?: string): string | null;
  transform(value: null | undefined, format?: string, timezone?: string, locale?: string): null;
  transform(value: Date | string | number | null | undefined, format?: string, timezone?: string, locale?: string): string | null;
  transform(
    value: string | Date,
    format: string = 'mediumDate',
    timezone: string = 'Europe/Prague'
  ): string {
    const timezoneOffset = timezone.startsWith("UTC") ? timezone : moment(value).tz(timezone).format('Z');
    return super.transform(value, format, timezoneOffset);
  }
}
