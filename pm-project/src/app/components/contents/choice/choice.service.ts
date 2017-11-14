import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import 'rxjs/add/operator/map';

import { APIService } from '../../../service'
import { ChoiceType,Choice  } from '../../../models'
import { Constants } from '../../../utils'

@Injectable()
export class ChoiceService {

    constructor(private api: APIService) { }

    getChoice(data: string): Observable<ChoiceType> {
        return this.api.post(Constants.API_GET_CHOICE_TYPE_BY_CODE,data).map(
            (res) => {
                let value: any = typeof res !== 'boolean';
                if(res){
                    value = res as ChoiceType;
                }
                return value;
            }
        );
    }
}