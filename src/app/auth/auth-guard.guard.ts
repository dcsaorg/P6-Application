import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Auth } from 'aws-amplify';
import { Globals } from '../model/portCall/globals';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private globals: Globals,
  ) { }
  async canActivate(): Promise<boolean | UrlTree> {
    if (this.globals.config.authentication === true) {
      try {
        const session = await Auth.currentSession()
        return session.isValid()
      } catch (e) {
        return false;
      }
    }
    return true;
  }
}
