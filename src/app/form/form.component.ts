import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValoriValutato } from '../comune/valoriValutato';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  vettDati: any;

  //titoli: string[] = [];
  //domFinali: string[] = [];
  punti: number[] = [];
  valutatore: boolean | undefined;
  //vettore con dati messi dal valutato
  vettoreV1: ValoriValutato[] = [];
  //vettore con dati messi dal valutatore
  vettoreV2: ValoriValutato[] = [];
  nomeValutato: string | undefined;
  nomeValutatore: string | undefined;
  ok: boolean | undefined;

  constructor(private miohttp: HttpClient) { }

  ngOnInit(): void {
    this.ok = false;
    //setTimeout(() => {
    this.miohttp.get("http://localhost:8000").subscribe((dati) => {
      console.log(dati);
      this.vettDati = dati;
      for (let index = 0; index < this.vettDati.domande.length; index++) {
        this.vettoreV1.push(new ValoriValutato());
        this.vettoreV2.push(new ValoriValutato());
      }
      this.ok = true;
    });
    //}, 1);

    this.valutatore = false;
    //this.titoli = ["PROBLEM SOLVING", "ORIENTAMENTO AL RISULTATO", "DECISIONE", "COOPERAZIONE", "FLESSIBILITA'", "INNOVAZIONE", "RESISTENZA ALLO STRESS", "IMPATTO"];
    //this.domFinali = ["Giudizio complessivo", "Punti forza", "Idee migliorie", "COMMENTI CONCLUSIVI (VALUTATO)", "COMMENTI CONCLUSIVI (VALUTATORE)", "COMMENTI CONCLUSIVI COLLOQUIO"];
    //this.punti = [];
    for (let index = 1; index < 6; index++) {
      this.punti.push(index);
    }
    /*for (let index = 0; index < this.vettDati.length; index++) {
      this.vettoreV1.push(new ValoriValutato());
      this.vettoreV2.push(new ValoriValutato());
    }*/
    //console.log(this.titoli);
    //console.log(this.punti);
    //this.miohttp.post();
  }

  mostra() {
    for (let index = 0; index < this.vettDati.domande.length; index++) {
      console.log(this.vettoreV1[index].punteggio);
      console.log(this.vettoreV1[index].Commento);
      console.log(this.vettoreV2[index].punteggio);
      console.log(this.vettoreV2[index].Commento);
    }
    console.log(this.nomeValutato);
    console.log(this.nomeValutatore);
  }
}
