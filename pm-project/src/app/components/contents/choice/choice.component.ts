import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';


import { ChoiceType, Choice } from './../../../models';
import { Data } from '../../../providers/data/data.service'
import { ChoiceService } from './choice.service'

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.css']
})

export class ChoiceComponent implements OnInit {
  title = "Choice";
  code: string;
  choiceType: ChoiceType;
  choiceNavigate: Choice[] = [];
  allChoiceOfChoiceType: Choice[] = [];
  selectListChoice: Choice[] = [];
  urlFullImage: string;
  filter: Choice;
  /* 
  * Declare variable of Paging
  */
  totalItems: number;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  maxPer: number = this.itemsPerPage;
  minPer: number = 0;

  constructor(
    private route: ActivatedRoute,
    private data: Data,
    private choiceService: ChoiceService
  ) { }

  ngOnInit() {
    this.choiceType = new ChoiceType();
    this.filter = new Choice();
    this.filter.choiceCode='';
    this.filter.choiceText='';
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.code = params.get('code');
    })
    this.getChoice(this.minPer, this.maxPer);
  }

  /**
   * Returns all choice and choice at the first page
   * 
   * @memberof ChoiceComponent
   * @author Tím
   */
  getChoice(min: number, max: number) {
    const getChoice = this.choiceService.getChoice(this.code)
      .subscribe(
      (value) => {
        if (value) {
          this.choiceType = value as ChoiceType;
          this.totalItems = value.choices.length;
          this.allChoiceOfChoiceType =value.choices
          this.choiceNavigate = value.choices.slice(min, max);
        } else {
          getChoice.unsubscribe();
        }
      }
      )
  }

  /**
   * Using show image and show full image if boolean is true
   * 
   * @param {Choice} choice 
   *               Choice needs to display the image
   * @param {boolean} [boolean] 
   *               If true, display the full image
   * @returns {string}  
   *               returns image url of choice
   * @memberof ChoiceComponent
   */
  showImage(choice: Choice, boolean?: boolean): string {
    let check = false;
    //Using to show full image
    if (boolean) {
      this.urlFullImage = "/assets/images/no_image_available.png"
    }
    let url = "/assets/images/no_image_available.png";
    // returns location of chocie 
    let index = this.choiceNavigate.indexOf(choice);
    if (index > -1 && this.choiceNavigate[index].images.length && check === false) {
      this.choiceNavigate[index].images.forEach(value => {
        if (value && value.imageActive === 1 && check === false) {
          check = true;
          url = value.imageUrl;
          if (boolean) {
            this.urlFullImage = value.imageUrl;
          }
        }
      })
    }
    return url;
  }

  /**
   * Paging
   * 
   * @param {*} event  
   *          get info while user  using keyup event 
   * @memberof ChoiceComponent
   */
  public pageChanged(event: any): void {
    this.maxPer = event.page * event.itemsPerPage;
    this.minPer = this.maxPer - event.itemsPerPage;
    this.getChoice(this.minPer, this.maxPer);
  }

  /**
   * The user clicks the checkbox
   * 
   * @param {any} event 
   * @memberof ChoiceComponent
   */
  checkAll(event) {
    console.log(event.target.checked)
    this.choiceNavigate.forEach(x => {
      x.checked = event.target.checked,
        console.log(x.checked);
    });
    this.selectListChoice = this.choiceNavigate.filter(x => x.checked === true);
  }

  /**
   * Check all checkbox
   * 
   * @returns 
   * @memberof ChoiceComponent
   */
  isAllChecked() {
    return this.choiceNavigate.every(
      x => x.checked,
      this.selectListChoice = this.choiceNavigate.filter(x => x.checked === false)
    )
  }

  /**
   * Check  the user has checked or not checked
   * 
   * @returns 
   * @memberof ChoiceComponent
   */
  isCheck() {
    let check = true;
    this.selectListChoice = this.choiceNavigate.filter(x => x.checked === true)
    if (this.selectListChoice && this.selectListChoice.length) {
      check = false;
    }
    return check;
  }

/**
 * 
 * 
 * @param {any} event 
 * @memberof ChoiceComponent
 */
filterChoice() {
    console.log(this.filter.choiceCode)
    this.choiceNavigate = this.allChoiceOfChoiceType.filter((value) => {
      console.log(value.choiceCode)
      if (value.choiceCode.toLowerCase().trim().indexOf(this.filter.choiceCode.toLowerCase().trim())>-1
      && value.choiceText.toLowerCase().trim().indexOf(this.filter.choiceText.toLowerCase().trim())>-1){
         return value;
      }
    })
  }

  clearFilter(){
    this.filter.choiceCode='';
    this.filter.choiceText='';
  }

}
