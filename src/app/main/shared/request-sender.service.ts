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
        id: string,
        pausePage: boolean = true
    ): Observable<any> {
        const res = new Subject<any>();
        this.loadCntrl.create({
            id,
            keyboardClose: true,
            message: messageOnLoader
        }).then(
            (loadingEl: HTMLIonLoadingElement) => {
                if (pausePage) {
                    loadingEl.present();
                }
                // The request should be send after the overlay is shown or we might miss closing it
                this.sendingTheRequest(requestSubject, successCallBack, errCallBack, timeToWaitToResent, id, res, pausePage);
            }
        );
        return res;
    }

    private sendingTheRequest(
        requestSubject: () => Observable<any>,
        successCallBack: (requestResult: any) => void,
        errCallBack: (err: any) => void,
        timeToWaitToResent: number,
        id: string,
        res: Subject<any>,
        pausePage: boolean
    ) {
        const reqRepeat = timer(0, timeToWaitToResent).subscribe(
            () => {
                const request = requestSubject().subscribe(
                (requestResult: any) => {
                    res.next(requestResult);
                    successCallBack(requestResult);
                    request.unsubscribe();
                    reqRepeat.unsubscribe();
                    if (pausePage) {
                        this.loadCntrl.dismiss(null, null, id);
                    }
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


