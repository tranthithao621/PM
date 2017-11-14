import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  titlePopup : any;
  button : any;
  addButton() {
  	this.button = 'add';
  	this.titlePopup = 'Add Choice Type';
  }

  editButton() {
  	this.button = 'edit';
  	this.titlePopup = 'Edit Choice Type';
  }

}
