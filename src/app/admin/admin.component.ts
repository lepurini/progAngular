import { Component, OnInit } from '@angular/core';
import { DomandaFine } from '../comune/domandaFine';
import { CondivisoService } from '../condiviso.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  questionarioScelto: string | undefined;

  url = "http://localhost:8000/";

  vettDati: any;
  vettDati2: any;
  vettDati3: any;

  idDipendente!: number;

  mostraBtn!: boolean[];

  ok!: boolean;
  ok2!: boolean;
  ok3!: boolean;
  ok4!: boolean;

  date: DomandaFine[] = [];
  //date: string[] = [];

  constructor(private condiviso: CondivisoService) { }

  ngOnInit() {
    this.ok = false;
    this.condiviso.prendiDati(this.url + "init").subscribe((data: any) => {
      this.vettDati = data;
      this.ok = true;
    });
  }

  cerca() {
    this.ok3 = false;
    this.date = [];
    this.mostraBtn = [];
    this.ok2 = false;

    if (this.questionarioScelto != undefined) {
      this.condiviso.prendiDati(this.url + "valutatore/" + this.condiviso.ritornaNum(this.questionarioScelto)).subscribe((data: any) => {
        console.log(data);
        this.vettDati2 = data;
        for (let element of this.vettDati2.dipendenti) {
          this.mostraBtn.push(Boolean(this.controllaUtentiQuestionari(element.id)));
        }
        this.ok2 = true;
      });
    } else {
      alert("Scegliere un questionario");
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

  prova(nome: string) {
    alert(nome);
  }

  passaDipendente(id: number) {
    this.date = [];
    this.ok3 = false;
    this.idDipendente = id;
    alert(this.idDipendente);

    for (let elemento of this.vettDati2.domande) {
      if (this.idDipendente == elemento.id_dipendente) {
        this.date.push(new DomandaFine(elemento.id));
        this.date[this.date.length - 1].nota = String(elemento.data).substring(0, String(elemento.data).indexOf("T"));
        console.log(this.date[this.date.length - 1].nota);
      }
    }

    this.ok3 = true;
  }
}
