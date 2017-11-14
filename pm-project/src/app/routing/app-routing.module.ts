import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChoiceComponent,ChoiceTypeComponent }   from '../components/contents/index';

const routes: Routes = [
  { path: '', redirectTo: '/choice-type', pathMatch: 'full' },
  { path: 'choice/:code',  component: ChoiceComponent },
  { path: 'choice-type', component: ChoiceTypeComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

