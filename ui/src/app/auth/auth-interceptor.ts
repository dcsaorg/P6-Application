import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Auth from '@aws-amplify/auth';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  omitCalls = ['auth', 'signin', 'signup', 'assets'];
  skipInterceptor: boolean = false;
  authToken: string = null;

  constructor(private authService: AuthService) {
    this.authService.getAccessToken().subscribe(
      result => {

        console.log(result);
        this.authToken = result;
      });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.omitCalls.forEach(api => {
      if (req.url.includes(api)) {
        this.skipInterceptor = true;
      }
    });


    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    if (this.authToken || this.skipInterceptor) {
      const tokenizedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.authToken) });
      return next.handle(tokenizedReq).pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // checking unAuthorizated access and log user out if so. 
          if (event.status === 401) {
            //    this.authService.logUserOut();
            //  this.router.navigateByUrl('signin');
            Auth.signOut();
          }
        }
        return event;
      }));
    }
    return next.handle(req);
  }
}