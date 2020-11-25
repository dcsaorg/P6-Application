import {Injectable} from '@angular/core';
import {PortcallTimestamp} from "../../model/portcall-timestamp";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  private paginatedTimestamps: BehaviorSubject<PortcallTimestamp[]>

  constructor() {
    this.paginatedTimestamps = new BehaviorSubject<PortcallTimestamp[]>([]);
  }

  refreshTimestamps = (newTimeStamps: PortcallTimestamp[]):void => this.paginatedTimestamps.next(newTimeStamps);

  observePaginatedTimestamps = ():Observable<PortcallTimestamp[]> => this.paginatedTimestamps.asObservable();
}
