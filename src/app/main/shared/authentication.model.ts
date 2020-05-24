import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';


export interface UserInfo {

    email: string;
    firstName: string;
    lastName: string;
    address: string;

}

export class AuthenticationModel {

    private helper: JwtHelperService = new JwtHelperService();
    private userInfo: UserInfo = {email: '', firstName: '', lastName: '', address: ''};
    private hasBeenExpired = false;

    constructor(private jwt?: string) {
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

    public updatePersonalInfo(
        email: string,
        firstName: string,
        lastName: string,
        address: string
        ) {
        this.userInfo = {email, firstName, lastName, address};
    }

    public getEmail(): string {
        return this.userInfo.email;
    }

    public isExpired(): boolean {
        return this.hasBeenExpired;
    }

    public getFirstName(): string{
        return this.userInfo.firstName;
    }

    public getLastName(): string{
        return this.userInfo.lastName;
    }

    public getAddress(): string{
        return this.userInfo.address;
    }

    public getJWT(): string{
        return this.jwt;
    }

    public getPersonalInfo(): UserInfo {
        console.log("shit shit shiiiiiit");
        console.log(this.userInfo);
        return {...this.userInfo};
    }

}
