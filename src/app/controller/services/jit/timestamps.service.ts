import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Timestamp} from '../../../model/jit/timestamp';
import {Globals} from '../../../model/portCall/globals';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimestampService {
  private readonly TIMESTAMPS_URL: string;
  private newTimestampNotifier = new BehaviorSubject<null>(null);
  newTimestampNotifier$ = this.newTimestampNotifier.asObservable();

  constructor(private httpClient: HttpClient, globals: Globals) {
    this.TIMESTAMPS_URL = globals.config.jitBackendURL + '/timestamps';
  }

  addTimestamp = (timestamp: Timestamp): Observable<Timestamp> => {
    return this.httpClient.post<Timestamp>(this.TIMESTAMPS_URL, timestamp).pipe(
      tap(_ => this.newTimestampNotifier.next(null)),
    );
  }
}
