import { Subject, Observable } from 'rxjs';
import { RequestSenderService } from './request-sender.service';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Plugins } from '@capacitor/core';
import { Injectable } from '@angular/core';
import { AuthenticationModel, UserInfo } from './authentication.model';


// TODO use v2.0.0 offline storage from ionic that uses NoSql
const { Storage } = Plugins;

export interface AuthenticationInfo {
    email: string;
    password: string;
}

export interface UserUpdateInfo {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    password: string;
    oldPassword: string;
}

interface JWTResponse {
    jwt: string;
}
// TODO ADD headers your self and remove two functions and make everything with subjects and observables
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private saveKey = 'jwt';
    private authenticationModel: AuthenticationModel;
    private authenticationModelStream: Subject<AuthenticationModel> = new Subject<AuthenticationModel>();

    public getAuthStream(): Observable<AuthenticationModel>{
        return this.authenticationModelStream.asObservable();
    }

    constructor(private httpClient: HttpClient, private requestSenderService: RequestSenderService) {
        this.authenticationModel = new AuthenticationModel();
        this.loadJWT().then(
            _ => this.getUserInfo()
        );
    }


    private authenticateFromServerWithSubject(authenticationInfo: AuthenticationInfo, onError?: () => void) {
        const subs =  this.requestSenderService.makeRequest(
            () => {
                return this.httpClient.post(environment.apiUrl + '/authenticate/', authenticationInfo, {headers:{'Access-Control-Allow-Origin':'*'}});
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
                this.getUserInfo();
            }
        );
        return subs;
    }

    public async authenticateFromServer(authenticationInfo: AuthenticationInfo, onError?: () => void) {
        const s = this.authenticateFromServerWithSubject(authenticationInfo, onError);
        await Promise.resolve(s.toPromise);
        await this.getUserInfo();
        this.authenticationModelStream.next(this.authenticationModel);
    }

    private singUpFromServerWithSubject(authenticationInfo: AuthenticationInfo, onError?: (err) => void) {
        const subs =  this.requestSenderService.makeRequest(
            () => {
                return this.httpClient.post(environment.apiUrl + '/users', authenticationInfo, {headers:{'Access-Control-Allow-Origin':'*'}});
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
                this.saveJWT(jwt.jwt).then(
                );
            }
        );
        return subs;
    }

    public async singUpFromServer(authenticationInfo: AuthenticationInfo, onError?: (err) => void) {
        const s = this.singUpFromServerWithSubject(authenticationInfo, onError);
        await Promise.resolve(s.toPromise);
        await this.getUserInfo();
        this.authenticationModelStream.next(this.authenticationModel);
    }

    // TODO check whether or not enc the jwt is a good idea
    private async saveJWT(jwt: string) {
        sessionStorage.setItem(this.saveKey, jwt);
        await Storage.set({
            key: this.saveKey,
            value: jwt
        });
    }

    private async loadJWT() {
        const jwtMapStorage = await Storage.get({ key: this.saveKey });
        if (jwtMapStorage !== null || typeof jwtMapStorage !== 'undefined') {
            this.authenticationModel.updateJWT(jwtMapStorage.value);
        }
        if (this.authenticationModel.isExpired()) {
            Storage.clear();    
            const jwtMap = await sessionStorage.getItem(this.saveKey);
            this.authenticationModel.updateJWT(jwtMap);
            console.log(this.authenticationModel.isExpired());
            if (this.authenticationModel.isExpired()) {
                sessionStorage.clear();
            }
        }
    }

    public getAuthenticationModel(): AuthenticationModel {
        return this.authenticationModel;
    }

    public logout() {
        sessionStorage.clear();
        Storage.clear();
        this.authenticationModel.updateJWT('');
        this.authenticationModelStream.next(this.authenticationModel);
    }


    public updateAccount(authenticationInfo: AuthenticationInfo, onError?: (err) => void,
                                     onSuccess?: (userInfo: UserInfo) => void) {
        const subs =  this.requestSenderService.makeRequest(
            () => {
                return this.httpClient.put(environment.apiUrl + '/users', authenticationInfo);
            },
            (res) => {},
            (err) => {
                console.log('User update failed.');
                console.log(err);
                if (typeof onError !== 'undefined') {
                    onError(err);
                }
            },
            500,
            'Updating your account !',
            AuthenticationService.name + this.updateAccount.name,
            true,
            0
            ) as Subject<UserInfo>;
        subs.subscribe(
            (userInfo: UserInfo) => {
                if (typeof onSuccess !== 'undefined') {
                    onSuccess(userInfo);
                }
                this.authenticationModel.updatePersonalInfo(userInfo.email, userInfo.firstName, userInfo.lastName, userInfo.address);
                this.authenticationModelStream.next(this.authenticationModel);
            }
        );
        return subs;
    }

    public getUserInfo(onError?: (err) => void) {
        if (this.authenticationModel.isExpired()) {
            return null;
        }
        const subs =  this.requestSenderService.makeRequest(
            () => {
                return this.httpClient.get(environment.apiUrl + '/users');
            },
            (res) => {},
            (err) => {
                console.log('Retrieving user info failed.');
                console.log(err);
                if (typeof onError !== 'undefined') {
                    onError(err);
                }
            },
            500,
            'Retrieving user account info !',
            AuthenticationService.name + this.getUserInfo.name,
            true,
            0
            ) as Subject<UserInfo>;
        subs.subscribe(
            (userInfo: UserInfo) => {
                this.authenticationModel.updatePersonalInfo(userInfo.email, userInfo.firstName, userInfo.lastName, userInfo.email);
                this.authenticationModelStream.next(this.authenticationModel);
            }
        );
        return subs;
    }



}
