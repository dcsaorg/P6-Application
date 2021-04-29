import {Injectable} from '@angular/core';
import {PortcallTimestamp} from "../../../model/portCall/portcall-timestamp";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  private paginatedTimestamps: BehaviorSubject<PortcallTimestamp[]>
  private _refreshNotifier: Subject<void> = new Subject<void>()

  constructor() {
    this.paginatedTimestamps = new BehaviorSubject<PortcallTimestamp[]>([]);
  }

  refreshTimestamps = (newTimeStamps: PortcallTimestamp[]): void => this.paginatedTimestamps.next(newTimeStamps);
  observePaginatedTimestamps = (): Observable<PortcallTimestamp[]> => this.paginatedTimestamps.asObservable();

  refreshNotifier = (): Subject<void> => this._refreshNotifier;
}
