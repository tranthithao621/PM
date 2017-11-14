import { Headers } from '@angular/http';
export class APIData {
    headers : Headers;
    // headers = new Headers({ 'Content-Type': 'application/json' });
    showErrorMes: boolean;
    showLoader: boolean;

    constructor() {
        this.showErrorMes = true;
        this.showLoader = true;
    }
}
