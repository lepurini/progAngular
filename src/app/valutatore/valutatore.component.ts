import { Component, OnInit } from '@angular/core';
import { CondivisoService } from '../condiviso.service';

@Component({
  selector: 'app-valutatore',
  templateUrl: './valutatore.component.html',
  styleUrls: ['./valutatore.component.css']
})
export class ValutatoreComponent implements OnInit {

  questionarioScelto: string | undefined;

  url = "http://localhost:8000/";

  vettDati: any;

  ok!: boolean;
  ok2!: boolean;
  //mostra: boolean | undefined;

  constructor(private condiviso: CondivisoService) { }

  ngOnInit() {
    this.ok = false;
    this.condiviso.prendiDati(this.url + "init").subscribe((data: any) => {
      this.vettDati = data;
      //console.log(this.vettDati[1] + "ciaooiuoiu");
      this.ok = true;
    });
  }

  cerca() {
    this.ok2 = false;

    if (this.questionarioScelto != undefined) {
      //this.url + this.condiviso.ritornaNum(this.questionarioScelto)
      this.condiviso.prendiDati(this.url + "valutatore/" + this.condiviso.ritornaNum(this.questionarioScelto)).subscribe((data: any) => {
        console.log(data);
        this.vettDati = data;
      })
    } else {
      alert("Scegliere un questionario")
    }
  }
}
