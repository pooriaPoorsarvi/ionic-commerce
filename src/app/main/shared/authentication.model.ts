import { JwtHelperService } from '@auth0/angular-jwt';



export class AuthenticationModel {

    private helper: JwtHelperService = new JwtHelperService();
    private email = '';
    private hasBeenExpired = false;

    constructor(private jwt?: string) {
        if (this.jwt !== undefined) {
            const tokenInfo = this.helper.decodeToken(this.jwt);
            this.hasBeenExpired = this.helper.isTokenExpired(this.jwt);
            this.email = tokenInfo.sub;
        } else {
            this.jwt = '';
        }
    }

    getEmail(): string {
        return this.email;
    }

    isExpired(): boolean {
        return this.hasBeenExpired;
    }

}
