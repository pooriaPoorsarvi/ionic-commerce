import { JwtHelperService } from '@auth0/angular-jwt';



export class AuthenticationModel {

    private helper: JwtHelperService = new JwtHelperService();
    private email = '';
    private hasBeenExpired = false;

    constructor(private jwt?: string) {
        this.updateJWT(jwt);
    }

    public updateJWT(jwt: string){
        const tokenInfo = this.helper.decodeToken(jwt);
        if (jwt === 'undefined' || jwt === null || tokenInfo === null || jwt === '') {
            return;
        }
        this.jwt = jwt;
        this.hasBeenExpired = this.helper.isTokenExpired(this.jwt);
        this.email = tokenInfo.sub;
    }

    public getEmail(): string {
        return this.email;
    }

    public isExpired(): boolean {
        return this.hasBeenExpired;
    }

}
