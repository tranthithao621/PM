import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm, FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import _ from 'lodash';

import { ChoiceType } from '../../../models/choice-type.model';
import { ChoiceTypeService } from './choice-type.service';
import { Data } from '../../../providers/data/data.service'

@Component({
  selector: 'app-choice-type',
  templateUrl: './choice-type.component.html',
  styleUrls: ['./choice-type.component.css']
})
export class ChoiceTypeComponent implements OnInit {
  alerts: any = [];
  allChoicetype: any[] = []; // Use to store all choicetype
  choiceTypes: any[] = []; // Used for paging
  choiceParent: any[] = []; // Sub-list
  isAddChoiceType: ChoiceType[] = [];
  listEditChoiceType: any[] = []; // Use to store checkbox list
  _delete: any[] = [];  // Used to store non-removable choice types
  _isdelete: boolean;  // Used open Model delete 
  _isparent: string[] = [];  // Used get all list parent of choice type
  _issearch: ChoiceType; //  Used to store search information
  _isfilter: boolean = false; // Used checking are searching or not
  _isreset: ChoiceType[] = []; // 
  _idparent: any[] = []; // Contains the parent id list for search
  _ischeckcode: boolean = false;
  errorCode: String = "-1"; //Check code
  listChoiceTypeCode: any[] = []
  choiceTypeCodes: any[] = [];
  /**
  * Declare variable for "Add Choice-Type"
  */
  getTime = Date.now();
  addForm: FormGroup;

  /* 
  * Declare variable of Paging
  */
  totalItems: number;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  maxPer: number = this.itemsPerPage;
  minPer: number = 0;

  //Declare popup "Add Choice-Type"
  @ViewChild('addModal') public addModal: ModalDirective;

  constructor(
    private fb: FormBuilder,
    private choiceTypeService: ChoiceTypeService,
    private router: Router,
    private data: Data
  ) {
    this.addForm = this.fb.group({
      addManyChoiceType: this.fb.array([
        this.newChoiceType()
      ])
    });
  }

  ngOnInit() {
    this._issearch = new ChoiceType();
    this._issearch.choiceTypeCode = "";
    this._issearch.checkparent = "";
    this._issearch.choiceTypeDes = "";
    this._issearch.choiceTypeAbb = "";
    this.getChoiceTypes(this.minPer, this.maxPer);

  }

  /**
   * 
   * 
   * @param {number} min 
   * @param {number} max 
   * @memberof ChoiceTypeComponent
   */
  getChoiceTypes(min: number, max: number): void {
    const getChoiceTypes = this.choiceTypeService.getChoiceTypes()
      .subscribe(value => {
        if (value) {
          this.totalItems = value.length;
          this.allChoicetype = value as ChoiceType[];
          console.log(this.allChoicetype);
          this.choiceTypes=value.slice(min, max);
          this.listChoiceTypeCode = this.allChoicetype.map(value => value.choiceTypeCode);
        }
        else {
          getChoiceTypes.unsubscribe();
        }
      });
  }

  /**
   * Show list parent choice while delete
   * @param {number} parents 
   * @returns 
   * @memberof ChoiceTypeComponent
   */
  showParent(parents: number) {
    let parent = this.allChoicetype.filter(x => x.choiceTypeId === parents);
    if (parent && parent.length) {
      return parent[0].choiceTypeDes + " [" + parent[0].choiceTypeCode + "]";
    }
  }

  /**
   * Change value while click number page
   * @param {*} event 
   * @memberof ChoiceTypeComponent
   */
  public pageChanged(event: any): void {
    this.maxPer = event.page * event.itemsPerPage;
    this.minPer = this.maxPer - event.itemsPerPage;
    if (this._isfilter) {
      this.getFilter();
    } else {
      this.getChoiceTypes(this.minPer, this.maxPer);
    }
  }

  /**
   * Click button check all
   * @param {any} event 
   * @memberof ChoiceTypeComponent
   */
  checkAll(event) {
    this.choiceTypes.forEach(x => x.checked = event.target.checked);
    this.listEditChoiceType = this.choiceTypes.filter(x => x.checked === true);
  }

  /**
   * Check checked all button
   * @returns 
   * @memberof ChoiceTypeComponent
   */
  isAllChecked() {
    return this.choiceTypes.every(
      x => x.checked,
    );
  }

  /**
   * 
   * 
   * @returns 
   * @memberof ChoiceTypeComponent
   */
  newChoiceType() {
    return new FormGroup({
      id: new FormControl(),
      choiceTypeCode: new FormControl('', [Validators.required, Validators.minLength(5), this.forbiddenChoiceTypeCode.bind(this)]),
      choiceTypeAbb: new FormControl('', Validators.required),
      choiceTypeDes: new FormControl('', Validators.required),
      choiceTypeParent: new FormControl(-1),
      choicechoiceTypeCreUid: new FormControl(1),
      choiceTypeCreTs: new FormControl(this.getTime),
      choiceTypeLstUpdtUid: new FormControl('-1'),
      choiceTypeLstUpdtTs: new FormControl(),
    });
  }

  /**
   * 
   * 
   * @private
   * @param {AbstractControl} c 
   * @returns 
   * @memberof ChoiceTypeComponent
   */
  private forbiddenChoiceTypeCode(c: AbstractControl) {
    return (this.choiceTypeCodes.includes(c.value)) ? {
      invalidusername: true
    } : null;
  };

  /**
   * 
   * 
   * @readonly
   * @type {FormArray}
   * @memberof ChoiceTypeComponent
   */
  get addManyChoiceType(): FormArray {
    return this.addForm.get('addManyChoiceType') as FormArray;
  }

  /**
   * 
   * 
   * @memberof ChoiceTypeComponent
   */
  resetAddRow() {
    const i = this.addManyChoiceType.length;
    for (let index = i; index >= 0; index--) {
      this.addManyChoiceType.removeAt(index);
    }
  }

  /**
   * 
   * 
   * @param {FormGroup} form 
   * @memberof ChoiceTypeComponent
   */
  createChoiceType(form: FormGroup) {
    if (this.addManyChoiceType.length) {
      this.choiceTypeService.addChoiceTypes(this.addManyChoiceType.value).subscribe(
        value => {
          this.getChoiceTypes(this.minPer, this.maxPer);
        });
      this.addModal.hide();
      this.notiMessage("Add Success!");
    } else {
      this.notiMessage("Add Error!");
    }
  }

  /**
   * 
   * 
   * @memberof ChoiceTypeComponent
   */
  addNewRow() {
    this.addManyChoiceType.push(this.newChoiceType());
  }


  /**
   * Enable button Edit and button Delete is checked Checkbox
   * 
   * @memberof ChoiceTypeComponent
   */
  getListEditChoiceType() {
    this.listEditChoiceType = this.choiceTypes.filter(x => x.checked === true);
  }

  /**
   * 
   * 
   * @memberof ChoiceTypeComponent
   */
  editChoiceTypes() {
    if (this.listEditChoiceType && this.listEditChoiceType.length) {
      const editChoiceTypes = this.choiceTypeService.editChoiceTypes(this.listEditChoiceType).subscribe(
        value => {
          if (value) {
            this.errorCode = "-1";
            this.getChoiceTypes(this.minPer, this.maxPer);
          } else {
            editChoiceTypes.unsubscribe();
          }
        });
    } else {
      this.notiMessage("Code Exists!");
    }
    this.listEditChoiceType.forEach(x => {
      x.checked = false;
      this.isCheck();
    }
    );
  }

/**
   * 
   * 
   * @returns 
   * @memberof ChoiceTypeComponent
   */
  isCheck() {
    let check = true;
    // console.log( this._ischeckcode + '-' + this.listEditChoiceType.length)
    this.listEditChoiceType = this.choiceTypes.filter(x => x.checked === true)
    if (this.listEditChoiceType && this.listEditChoiceType.length && this._ischeckcode === false) {
      check = false;
    } 
    console.log(check);
    return check;
  }

  /**
   * 
   * 
   * @param {*} event 
   * @returns 
   * @memberof ChoiceTypeComponent
   */
  checkCode(event: any) {
    let code = event.target.value;
    let i: number = 0;
    this.allChoicetype.forEach(value => {
      if (value.choiceTypeCode === code) {
        i = i + 1;
        this.errorCode ="-1";
        this._ischeckcode =false;
        if (i > 1 && this._ischeckcode ===false ) {
          this._ischeckcode = true;
          this.errorCode = code;
        }
      }
    })
    return this.errorCode;
  }

  /**
   * 
   * 
   * @memberof ChoiceTypeComponent
   */
  isReset(form: NgForm) {
    this._isreset =_.clone(form.value);
  }


  resetData(form: NgForm){
    this.errorCode ="-1";
    this._ischeckcode = false;
    console.log(this._ischeckcode + '-' + this.errorCode);
    form.reset(this._isreset);
  }

  /**
   * 
   * 
   * @param {*} event 
   * @memberof ChoiceTypeComponent
   */
  checkChoiceTypeParent(event: any) {
    this.choiceTypeCodes = this.listChoiceTypeCode.concat(this.addForm.value.addManyChoiceType.map(x => x.choiceTypeCode));
  }

  /**
   * 
   * 
   * @param {*} x 
   * @memberof ChoiceTypeComponent
   */
  getListParent(x: any) {
    let check = true
    let i = 1;
    if (this._isparent && this._isparent.length) {
      this._isparent.forEach(value => {
        if (check) {
          if (value.length && value === x) {
            check = false;
          }
        }
      })
      if (check) {
        this._isparent.push(x);
      }
    } else {
      this._isparent.push(x);

    }
  }

  /**
   * 
   * 
   * @memberof ChoiceTypeComponent
   */
  checkDelete() {
    this.listEditChoiceType.forEach(value => {
      this.allChoicetype.forEach(x => {
        if ((x.choiceTypeParent === value.choiceTypeId)) {
          this._delete.push(x);
          this.getListParent(value.choiceTypeCode)
        }
      }
      );
    })
    if (this._delete && this._delete.length) {
      this._isdelete = false;
    } else {
      this._isdelete = true;
    }
  }

  /**
   * 
   * 
   * @memberof ChoiceTypeComponent
   */
  isDelete() {
    if (this.listEditChoiceType && this.listEditChoiceType.length) {
      const deleteChoiceTyes = this.choiceTypeService.deleteChoiceTyes(this.listEditChoiceType)
        .subscribe(value => {
          if (value) {
            this._delete = [];
            this.getChoiceTypes(this.minPer, this.maxPer);
          } else {
            deleteChoiceTyes.unsubscribe();
          }
        })
      this.notiMessage("Delete Success!");
    } else {
      //Báo lỗi chưa check
    }
  }

  /**
   * 
   * 
   * @returns 
   * @memberof ChoiceTypeComponent
   */
  isNotDelete() {
    let code = " ";
    let test = [];
    if (this._delete && this._delete.length) {
      this._delete.forEach(value => {
        test.push(value.choiceTypeCode);
        if (test)
          code += value.choiceTypeCode + " "
      });
    }
    return code;
  }

  /**
   * 
   * 
   * @memberof ChoiceTypeComponent
   */
  getFilter() {
    this.choiceTypes = this.choiceParent.slice(this.minPer, this.maxPer);
  }

  /**
   * 
   * 
   * @memberof ChoiceTypeComponent
   */
  isFindFilter() {
    this._isfilter = true;
    this.listEditChoiceType = [];
    if (this._issearch.checkparent && this._issearch.checkparent.length) {
      this._idparent = this.allChoicetype.filter(x => {
        if (x.choiceTypeCode.indexOf(this._issearch.checkparent.trim()) > -1 || x.choiceTypeDes.toLowerCase().indexOf(this._issearch.checkparent.trim().toLowerCase()) > -1) {
          return x.choiceTypeId;
        }
      })
    }
    this.choiceParent = this.allChoicetype.filter(value => {
      if (value.choiceTypeCode.indexOf(this._issearch.choiceTypeCode.trim()) > -1
        && value.choiceTypeDes.toLowerCase().indexOf(this._issearch.choiceTypeDes.trim().toLowerCase()) > -1
        && value.choiceTypeAbb.toLowerCase().indexOf(this._issearch.choiceTypeAbb.trim().toLowerCase()) > -1) {
        if (this._issearch.checkparent && this._issearch.checkparent.length) {
          let parent = this._idparent.filter(x => {
            if (x.choiceTypeId === value.choiceTypeParent) {
              return x;
            }
          })
          return parent[0];
        } else {
          return value;
        }
      }
    })
    this.totalItems = this.choiceParent.length;
    this.getFilter();
  }

  /**
   * 
   * 
   * @param {*} event 
   * @memberof ChoiceTypeComponent
   */
  isFindByParent(event: any) {
    this._issearch.checkparent = event.target.value;
    this.isFindFilter();
  }

  /**
   * 
   * 
   * @memberof ChoiceTypeComponent
   */
  closeAdd() {
    this.choiceTypeCodes.splice(0, this.choiceTypeCodes.length);
    this.resetAddRow();
    this.addNewRow();
    this.addModal.hide();
    this.getChoiceTypes(this.minPer, this.maxPer);
  }
  closeDelete(){
    this._delete.splice(0, this._delete.length);
    this._isparent.splice(0, this._isparent.length);
    this.getChoiceTypes(this.minPer, this.maxPer);
  }
  closeEdit(){
    this.listEditChoiceType.forEach(x => {
      x.checked = false;
      this.isCheck();
    }
    );
    this.getChoiceTypes(this.minPer, this.maxPer);
  }

  /**
   * 
   * 
   * @memberof ChoiceTypeComponent
   */
  isClearFilter() {
    this._isfilter = false;
    this._issearch.choiceTypeCode = "";
    this._issearch.checkparent = "";
    this._issearch.choiceTypeDes = "";
    this._issearch.choiceTypeAbb = "";
    this._issearch.choiceTypeParent = null;
    this.getChoiceTypes(this.minPer, this.maxPer);
  }

  /**
   * 
   * 
   * @param {string} noti 
   * @memberof ChoiceTypeComponent
   */
  notiMessage(noti: string): void {
    console.log(noti),
      this.alerts.push({
        msg: noti,
        timeout: 5000
      });
  }

  gotoChoice(data : any){
    this.router.navigate(["/choice",data])
  }
}


