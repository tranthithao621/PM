import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from "rxjs/Observer";

import 'rxjs/add/operator/map';
import { Constants } from '../../../utils/constans';
import { ChoiceType } from '../../../models/choice-type.model'
import { APIService } from '../../../service'

@Injectable()
export class ChoiceTypeService {
    
    constructor(private api : APIService) { }

    getChoiceTypes(): Observable<ChoiceType[] > {
        return this.api.post(Constants.API_GET_ALL_CHOICE_TYPE).map(
         (res) => {
            let value: any = typeof res !== 'boolean';

            if (value) {
                value = res as ChoiceType[];
            }
            return value;
        });
    }

    editChoiceTypes(data :any ){
        return this.api.post(Constants.API_EDIT_CHOICE_TYPE,data);
    }

    addChoiceTypes(data :any ){
        return this.api.post(Constants.API_ADD_CHOICE_TYPE,data);
    }

    deleteChoiceTyes(data:any){ 
        return this.api.post(Constants.API_DELETE_CHOICE_TYPE,data);
    }

}