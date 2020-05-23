import { JwtHelperService } from '@auth0/angular-jwt';



export class AuthenticationModel {

    private helper: JwtHelperService = new JwtHelperService();
    private email = '';
    private hasBeenExpired = false;

    constructor(private jwt?: string) {
        this.updateJWT(jwt);
    }

    // TODO add documentation
    public updateJWT(jwt: string){
        if (jwt === 'undefined' || jwt === null) {
            return;
        }
        const tokenInfo = this.helper.decodeToken(jwt);
        if (jwt === '' || tokenInfo === null) {
            this.jwt = jwt;
            this.hasBeenExpired = true;
            this.email = '';
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
