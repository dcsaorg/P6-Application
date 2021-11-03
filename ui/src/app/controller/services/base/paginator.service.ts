import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {Timestamp} from "../../../model/jit/timestamp";

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  private paginatedTimestamps: BehaviorSubject<Timestamp[]>
  private _refreshNotifier: Subject<void> = new Subject<void>()

  constructor() {
    this.paginatedTimestamps = new BehaviorSubject<Timestamp[]>([]);
  }

  refreshTimestamps = (newTimeStamps: Timestamp[]): void => this.paginatedTimestamps.next(newTimeStamps);
  observePaginatedTimestamps = (): Observable<Timestamp[]> => this.paginatedTimestamps.asObservable();

  refreshNotifier = (): Subject<void> => this._refreshNotifier;
}
