import { AuthenticationService } from './main/shared/authentication.service';
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private authenticationService: AuthenticationService
    ) {}


    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
            const headers = {'Access-Control-Allow-Origin': '*',
                            'Authorization': 'Bearer ' + this.authenticationService.getAuthenticationModel().getJWT()};
            if ( this.authenticationService.getAuthenticationModel().isExpired() ) {
                delete headers['Authorization'];
            }
            req = req.clone({
                setHeaders: headers
            });
            // TODO clear out commments
            // console.log('headers');
            // console.log(headers);
            // console.log(req.headers);
            // console.log(req.url);
            return next.handle(req);
    }
}




export const jwtInterceptorProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
];
