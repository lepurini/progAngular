import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValoriValutato } from '../comune/valoriValutato';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  //variabile che conterrà i dati ricevuti dal server 
  vettDati: any;

  //vettore che contiene i numeri da 1 a 5
  punti: number[] = [];
  valutatore: boolean | undefined;

  //oggetto che contiene il nome, la data e le risposte al questionario
  vettoreV1: ValoriValutato | undefined;


  //variabile che mostra parti della pagina solo quando sono arrivati i dati
  ok: boolean | undefined;

  //vettore contenente le domande della prima parte
  vDom1: any[] = [];
  //vettore contenente le domande della seconda parte
  vDom2: any[] = [];

  constructor(private miohttp: HttpClient) { }

  ngOnInit(): void {
    this.ok = false;

    //richiesta al server
    this.miohttp.get("http://localhost:8000").subscribe((dati) => {
      console.log(dati);
      this.vettDati = dati;
      //controllo per dividere le domande con descrizione da quelle che vanno in fondo
      for (let i = 0; i < this.vettDati.domande.length; i++) {
        if (this.vettDati.domande[i].descrizione != undefined) {
          this.vDom1.push(this.vettDati.domande[i]);
        }
        else {
          this.vDom2.push(this.vettDati.domande[i]);
        }
      }
      //dati arrivati --> possibile mostrare parti della pagina
      this.ok = true;
    });

    this.vettoreV1 = new ValoriValutato();

    this.valutatore = false;

    for (let index = 1; index < 6; index++) {
      this.punti.push(index);
    }
  }

  noVuoto(): boolean {
    //se nome o data non definiti non mando i dati
    if (this.vettoreV1?.data == undefined || this.vettoreV1.nome == undefined) {
      return false;
    }

    //se risposte indefinite o "" non mando i dati
    for (let i = 0; i < this.vettDati.domande.length; i++) {
      if ((this.vettoreV1!.punteggio[i] == undefined) || (this.vettoreV1!.Commento[i] == undefined /*|| this.vettoreV1!.Commento[i] == ""*/)) {
        return false;
      }
      this.vettoreV1!.Commento[i] = this.vettoreV1!.Commento[i].trim();
      if (this.vettoreV1!.Commento[i] == "") {
        return false;
      }
    }

    //se risposte indefinite o "" non mando i dati
    for (let i = 0; i < this.vettDati.domFinali.length; i++) {
      if (this.vettDati.domFinali[i] == undefined /*|| this.vettDati.domFinali[i] == ""*/) {
        return false;
      }
      this.vettoreV1!.domFinali[i] = this.vettoreV1!.domFinali[i].trim();
      if (this.vettDati.domFinali[i] == "") {
        return false;
      }
    }
    return true;
  }

  invia() {
    //if (this.noVuoto()) {
    console.log(this.vettoreV1?.data);
    return this.miohttp.post("http://localhost:8000", JSON.stringify(this.vettoreV1), { responseType: 'text' }).subscribe((data) => {
      console.log(data);
    });
    //} else {
    //alert("Come ti permetti");
    //return false;
    //}
  }
}
