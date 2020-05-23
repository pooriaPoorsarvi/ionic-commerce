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


    private authenticateFromServerWithSubject(authenticationInfo: AuthenticationInfo) {
        const subs =  this.requestSenderService.makeRequest(
            () => {
                return this.httpClient.post(environment.apiUrl + '/authenticate/', authenticationInfo);
            },
            (res) => {},
            (err) => {
                console.log('Authenticating failed.');
                console.log(err);
            },
            500,
            'Authenticating...',
            AuthenticationService.name + this.authenticateFromServer.name,
            ) as Subject<JWTResponse>;
        subs.subscribe(
            (jwt: JWTResponse) => {
                this.authenticationModel.updateJWT(jwt.jwt);
                this.saveJWT(jwt.jwt);
            }
        );
        return subs;
    }

    public async authenticateFromServer(authenticationInfo: AuthenticationInfo) {
        const s = this.authenticateFromServerWithSubject(authenticationInfo);
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
