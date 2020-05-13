import { Subject, timer, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class RequestSenderService {

    maxWaitTime = 2000;

    constructor(private loadCntrl: LoadingController) {}



    // TODO add documentation for this function specially say that the id should be class name plus function name
    makeRequest(
        requestSubject: () => Observable<any>,
        successCallBack: (requestResult: any) => void,
        errCallBack: (err: any) => void,
        timeToWaitToResent: number,
        messageOnLoader: string,
        id: string,
        pausePage: boolean = true,
        maxTry: number = 100,
    ): Observable<any> {
        timeToWaitToResent = Math.min(this.maxWaitTime, timeToWaitToResent);
        console.log(timeToWaitToResent);
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
                this.sendingTheRequest(requestSubject, successCallBack, errCallBack, timeToWaitToResent, id, res, pausePage, maxTry);
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
        pausePage: boolean,
        maxTry: number
    ) {
        let currentTries = 0;
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
                    currentTries += 1;
                    if (currentTries > maxTry) {
                        request.unsubscribe();
                        reqRepeat.unsubscribe();
                        if (pausePage) {
                            this.loadCntrl.dismiss(null, null, id);
                        }
                    }
                    errCallBack(err);
                }
                );
            }
            );
        return res;
    }


}


