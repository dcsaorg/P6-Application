import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
  omitCalls = ['auth','signin','signup'];
  skipInterceptor :boolean = false;
  authToken: string;

  constructor(  private authService: AuthService,
                private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    this.omitCalls.forEach(api => {
        if (req.url.includes(api)) {
          this.skipInterceptor = true;
        }
      });

    // Get the auth token from the service.
    const authToken = this.authService.getAuthorizationToken();

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    if (authToken || this.skipInterceptor) {    
        const tokenizedReq = req.clone({ headers: req.headers.set('Authorization', authToken) });
        return next.handle(tokenizedReq).pipe(map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
              // checking unAuthorizated access and log user out if so. 
            if (event.status === 401) {
              this.authService.logUserOut();
              this.router.navigateByUrl('signin');
            }
          }
          return event;
        }));
      } else {
        this.authService.logUserOut();
        this.router.navigateByUrl('signin');
      }
      return next.handle(req);
    }
}
