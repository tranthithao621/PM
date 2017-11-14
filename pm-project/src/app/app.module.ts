import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';

import { NgxBootstrapModule } from './ngx-bootstrap.module/ngx-bootstrap.module'
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { LeftMenuComponent } from './components/shared/left-menu/left-menu.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ChoiceTypeComponent } from './components/contents/choice-type/choice-type.component';
import { ChoiceService } from './components/contents/choice/choice.service'
import { ChoiceComponent } from './components/contents/choice/choice.component';
import { AppRoutingModule } from './routing/app-routing.module';
import { ChoiceTypeService } from './components/contents/choice-type/choice-type.service';
import { APIService } from './service';
import { Data } from './providers/data/data.service'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftMenuComponent,
    FooterComponent,
    ChoiceTypeComponent,
    ChoiceComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgxBootstrapModule,
    AppRoutingModule
  ],
  providers: [ChoiceTypeService, APIService, Data, ChoiceService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

