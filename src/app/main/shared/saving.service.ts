import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;


@Injectable({providedIn : 'root'})
export class SavingService {

    constructor() {}

    async saveObject(key: string, json: string) {
        sessionStorage.setItem(key, json);
        await Storage.set({
            key,
            value: json
        });
    }

    async retrieveObject(key: string) {
        let result = await sessionStorage.getItem(key);
        if (typeof result === 'undefined' || result === null){
            const r = await Storage.get({
                key
            });
            result = r.value;
        }
        return result;
    }

}




