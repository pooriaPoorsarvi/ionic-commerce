import { Subject } from 'rxjs';
import { RequestSenderService } from './request-sender.service';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { Plugins } from '@capacitor/core';
import { Injectable } from '@angular/core';
import { AuthenticationModel } from './authentication.model';


// TODO use v2.0.0 offline storage from ionic that uses NoSql
const { Storage } = Plugins;

export interface AuthenticationInfo {
    email: string;
    password: string;
}

interface JWTResponse {
    jwt: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private saveKey = 'jwt';
    private authenticationModel: AuthenticationModel = new AuthenticationModel();

    constructor(private httpClient: HttpClient, private requestSenderService: RequestSenderService) {
        this.loadJWT();
    }


    private authenticateFromServerWithSubject(authenticationInfo: AuthenticationInfo, onError?: () => void) {
        const subs =  this.requestSenderService.makeRequest(
            () => {
                return this.httpClient.post(environment.apiUrl + '/authenticate/', authenticationInfo);
            },
            (res) => {},
            (err) => {
                console.log('Authenticating failed.');
                console.log(err);
                if (typeof onError !== 'undefined') {
                    onError();
                }
            },
            500,
            'Authenticating...',
            AuthenticationService.name + this.authenticateFromServer.name,
            true,
            0
            ) as Subject<JWTResponse>;
        subs.subscribe(
            (jwt: JWTResponse) => {
                this.authenticationModel.updateJWT(jwt.jwt);
                this.saveJWT(jwt.jwt);
            }
        );
        return subs;
    }

    public async authenticateFromServer(authenticationInfo: AuthenticationInfo, onError?: () => void) {
        const s = this.authenticateFromServerWithSubject(authenticationInfo, onError);
        await Promise.resolve(s.toPromise);
    }

    private singUpFromServerWithSubject(authenticationInfo: AuthenticationInfo, onError?: (err) => void) {
        const subs =  this.requestSenderService.makeRequest(
            () => {
                return this.httpClient.post(environment.apiUrl + '/users', authenticationInfo);
            },
            (res) => {},
            (err) => {
                console.log('Sign up failed.');
                console.log(err);
                if (typeof onError !== 'undefined') {
                    onError(err);
                }
            },
            500,
            'Signing you up !',
            AuthenticationService.name + this.singUpFromServer.name,
            true,
            0
            ) as Subject<JWTResponse>;
        subs.subscribe(
            (jwt: JWTResponse) => {
                this.authenticationModel.updateJWT(jwt.jwt);
                this.saveJWT(jwt.jwt);
            }
        );
        return subs;
    }

    public async singUpFromServer(authenticationInfo: AuthenticationInfo, onError?: (err) => void) {
        const s = this.singUpFromServerWithSubject(authenticationInfo, onError);
        await Promise.resolve(s.toPromise);
    }

    // TODO check whether or not enc the jwt is a good idea
    private async saveJWT(jwt: string) {
        await Storage.set({
            key: this.saveKey,
            value: jwt
        });
    }

    private async loadJWT() {
        const jwtMap = await Storage.get({ key: this.saveKey });
        this.authenticationModel.updateJWT(jwtMap.value);
        if (this.authenticationModel.isExpired) {
            Storage.clear();
        }
    }

    public getAuthenticationModel(): AuthenticationModel {
        return this.authenticationModel;
    }

    public logout(){
        Storage.clear();
        this.authenticationModel.updateJWT('');
        console.log(this.authenticationModel.isExpired());
    }


}
