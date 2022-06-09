import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormComponent } from './form/form.component';
import { HttpClientModule } from '@angular/common/http';
import { FinitoComponent } from './finito/finito.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    FinitoComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
