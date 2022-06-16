import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormComponent } from './form/form.component';
import { HttpClientModule } from '@angular/common/http';
import { FinitoComponent } from './finito/finito.component';
import { RouterModule } from '@angular/router';
import { PagInizialeComponent } from './pag-iniziale/pag-iniziale.component';
import { ValutatoreComponent } from './valutatore/valutatore.component';
import { AdminComponent } from './admin/admin.component';


const LISTA = [
  { path: '', component: PagInizialeComponent },
  { path: 'questionario', component: FormComponent },
  { path: 'valutatore', component: ValutatoreComponent },
  { path: 'admin', component: AdminComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    FinitoComponent,
    PagInizialeComponent,
    ValutatoreComponent,
    AdminComponent,
    
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(LISTA)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
