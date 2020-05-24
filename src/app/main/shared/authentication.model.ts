import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';


export class UserInfo {

    constructor(
        public email: string,
        public firstName: string,
        public lastName: string,
        public address: string
        ) {}

}

export class AuthenticationModel {

    private helper: JwtHelperService = new JwtHelperService();
    private userInfo: UserInfo = new UserInfo('', '', '', '');
    private hasBeenExpired = false;

    constructor(private httpClient: HttpClient, private jwt?: string) {
        this.updateJWT(jwt);
    }

    // TODO add documentation
    public updateJWT(jwt: string) {
        if (jwt === 'undefined' || jwt === null) {
            return;
        }
        const tokenInfo = this.helper.decodeToken(jwt);
        if (jwt === '' || tokenInfo === null) {
            this.jwt = jwt;
            this.hasBeenExpired = true;
            this.userInfo.email = '';
            return;
        }
        this.jwt = jwt;
        this.hasBeenExpired = this.helper.isTokenExpired(this.jwt);
        this.userInfo.email = tokenInfo.sub;
    }

    public getEmail(): string {
        return this.userInfo.email;
    }

    public isExpired(): boolean {
        return this.hasBeenExpired;
    }

}
