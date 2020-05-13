import { Subject, timer, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class RequestSenderService {

    constructor(private loadCntrl: LoadingController) {}



    // TODO add documentation for this function specially say that the id should be class name plus function name
    makeRequest(
        requestSubject: () => Observable<any>,
        successCallBack: (requestResult: any) => void,
        errCallBack: (err: any) => void,
        timeToWaitToResent: number,
        messageOnLoader: string,
        id: string
    ): Observable<any> {
        const res = new Subject<any>();
        this.loadCntrl.create({
            id,
            keyboardClose: true,
            message: messageOnLoader
        }).then(
            (loadingEl: HTMLIonLoadingElement) => {
                loadingEl.present();
            }
        );
        const reqRepeat = timer(0, timeToWaitToResent).subscribe(
        () => {
            const request = requestSubject().subscribe(
            (requestResult: any) => {
                res.next(requestResult);
                successCallBack(requestResult);
                request.unsubscribe();
                reqRepeat.unsubscribe();
                this.loadCntrl.dismiss(null, null, id);
            },
            err => {
                errCallBack(err);
            }
            );
        }
        );
        return res;
    }


}


