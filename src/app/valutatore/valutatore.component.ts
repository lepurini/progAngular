import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CondivisoService } from '../condiviso.service';

@Component({
  selector: 'app-valutatore',
  templateUrl: './valutatore.component.html',
  styleUrls: ['./valutatore.component.css']
})
export class ValutatoreComponent implements OnInit {

  questionarioScelto!
    : string;

  url = "http://localhost:8000/";

  vettDati: any;
  vettDati2: any;
  vettDati3: any;

  mostraBtn!: boolean[];

  vNome!: string;

  ok!: boolean;
  ok2!: boolean;

  //mostra: boolean | undefined;

  constructor(private condiviso: CondivisoService, private router: Router) { }

  ngOnInit() {
    this.ok = false;
    this.condiviso.prendiDati(this.url + "init").subscribe((data: any) => {
      this.vettDati = data;
      console.log(this.vettDati);
    });
    this.condiviso.prendiDati(this.url + "prendiValutatori").subscribe((data: any) => {
      this.vettDati3 = data;
      console.log(this.vettDati3);
      this.ok = true;
    });
    //this.nome = undefined;
  }

  cerca() {
    this.mostraBtn = [];
    this.ok2 = false;

    if (this.questionarioScelto != undefined && this.vNome != undefined) {
      //this.url + this.condiviso.ritornaNum(this.questionarioScelto)
      //console.log(this.vNome.substring(this.vNome.indexOf(')')+ 1));
      console.log(this.url + "v/" + this.vNome.substring(this.vNome.indexOf(')') + 2) + "/" + this.condiviso.ritornaNum(this.vNome) + "/" + this.condiviso.ritornaNum(this.questionarioScelto));
      this.condiviso.prendiDati(this.url + "v/" + this.vNome.substring(this.vNome.indexOf(')') + 2) + "/" + this.condiviso.ritornaNum(this.vNome) + "/" + this.condiviso.ritornaNum(this.questionarioScelto)).subscribe((data: any) => {
        console.log(data);
        this.vettDati2 = data;
        for (let element of this.vettDati2.dipendenti) {
          this.mostraBtn.push(Boolean(this.controllaUtentiQuestionari(element.id)))
        }
        this.ok2 = true;
      });
    } else {
      alert("Scegliere un questionario e il nome")
    }
  }

  controllaUtentiQuestionari(id: number): boolean {
    for (let element of this.vettDati2.domande) {
      if (element.id_dipendente == id) {
        return true;
      }
    }
    return false;
  }

  valuta(idValutatore: number, idValutato: number, idQuestionario: number, cognomenome: string) {
    //alert(nome);
    this.condiviso.passaDatiResponsabile(idValutatore, idValutato, idQuestionario, cognomenome);
    alert(idValutatore + " - - - " + idValutato + " - - - " + idQuestionario);
    this.condiviso.setDaV(true);
    this.condiviso.getDaV();
    this.router.navigateByUrl('/questionario');
  }

  ritornaId(nome: string): number {
    return this.condiviso.ritornaNum(nome);
  }
}
