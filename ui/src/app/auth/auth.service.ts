import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenDataSource = new ReplaySubject<string>()
  tokenObservable = this.tokenDataSource.asObservable()

  async resolveToken(): Promise<void> {
    try {
      const session = await Auth.currentSession();
      this.tokenDataSource.next(session.getAccessToken().getJwtToken())
    } catch (e) {
    }
    return;
  }

}
