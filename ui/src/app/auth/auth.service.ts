import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { from } from 'rxjs/internal/observable/from';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  getAccessToken(): Observable<string> {
    return from(Auth.currentSession()).pipe(
      catchError(error => {
        return Observable.throw(error);
      }),
      map((session) => {
        return session.getAccessToken().getJwtToken()
      })
    )
  }

  public isAuthenticated(): Observable<boolean> {
    return from(Auth.currentSession()).pipe(
      catchError(error => {
        return Observable.throw(error);
      }),
      map((session) => {
        return session.isValid();
      })
    )
  }
}