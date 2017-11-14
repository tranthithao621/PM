import { APIData, ErrorResponse } from '../models';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core'
import { RequestOptions, Response, Http, Request, Headers } from '@angular/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';


@Injectable()
export class APIService {

    private _error: ErrorResponse;

    constructor(private http: Http) { }

    public get error() {
        return this._error;
    }

    post(api: string, data: Object = null, opts: APIData = { showLoader: false } as APIData): Observable<Object> {

        this._error = null;

        const options = new RequestOptions;

        if (opts && opts.headers) {
            options.headers = opts.headers;
            options.withCredentials = true;
        }
 
        return this.http.post(api, data, options).map(
            (response: Response) => {

                let res: any = true;

                if (response && response.text()) {
                    res = response.json();
                }
                
                if (res && res.error) {
                    this._error = res;

                    let message: string;
                    if (this._error && this._error.message) {
                        message = '<li>' + this._error.messages.join('</li><li>') + '</li>';
                    }
                    if (!message) {
                        message = this._error.message;
                    }

                    // this.messageService.add({ severity: 'error', summary: 'Error', detail: message });

                    res = false;
                }
                return res;
            }).finally(() => null);

    }

}