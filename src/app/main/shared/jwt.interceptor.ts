import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private authenticationService: AuthenticationService
    ) {}


    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
            const headers = {'Access-Control-Allow-Origin': '*'};
            if ( !this.authenticationService.getAuthenticationModel().isExpired() ) {
                console.log('interceptor jwt : ', !this.authenticationService.getAuthenticationModel().isExpired());
                headers['Authorization'] =  'Bearer ' + this.authenticationService.getAuthenticationModel().getJWT();
            }
            req = req.clone({
                setHeaders: headers
            });
            return next.handle(req);
    }
}




export const jwtInterceptorProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
];
