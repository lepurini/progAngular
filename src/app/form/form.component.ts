import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValoriValutato } from '../comune/valoriValutato';
import { Domanda } from '../comune/domanda';
import { DomandaFine } from '../comune/domandaFine';

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

  nome: string | undefined;

  //oggetto che contiene il nome, la data e le risposte al questionario
  vettoreV1: ValoriValutato | undefined;


  //variabile che mostra parti della pagina solo quando sono arrivati i dati
  ok: boolean | undefined;

  //vettore contenente le domande della prima parte
  vDom1: any[] = [];
  //vettore contenente le domande della seconda parte
  vDom2: any[] = [];

  /*oggetto: {
    nombre: string;
    id: number;
  } | undefined*/

  constructor(private miohttp: HttpClient) { }

  ngOnInit(): void {
    this.ok = false;
    this.vettoreV1 = new ValoriValutato();

    //richiesta al server
    this.miohttp.get("http://localhost:8000").subscribe((dati) => {
      console.log(dati);
      this.vettDati = dati;
      //controllo per dividere le domande con descrizione da quelle che vanno in fondo
      for (let i = 0; i < this.vettDati.domande.length; i++) {
        //this.vettoreV1?.risposteDomande.push(new Domanda());
        if (this.vettDati.domande[i].tipo == 1) {
          this.vettoreV1?.risposteDomande.push(new Domanda(this.vettDati.domande[i].id));
          this.vDom1.push(this.vettDati.domande[i]);
        }
        else {
          this.vettoreV1?.domFinali.push(new DomandaFine(this.vettDati.domande[i].id));
          this.vDom2.push(this.vettDati.domande[i]);
        }
      }
      //dati arrivati --> possibile mostrare parti della pagina
      this.ok = true;
    });



    this.valutatore = false;

    for (let index = 1; index < 6; index++) {
      this.punti.push(index);
    }
  }

  /*noVuoto() {
    //se nome o data non definiti non mando i dati
    if (this.vettoreV1?.data == undefined || this.vettoreV1.nome == undefined) {
      console.log("a");
      throw new Error("Campo data o nome non compilati");
    }

    //se risposte indefinite o "" non mando i dati
    for (let i = 0; i < this.vettDati.domande.length; i++) {
      try {
        this.vettoreV1!.Commento[i] = this.vettoreV1!.Commento[i].toString().trim();
      } catch (error) {
        console.log(error);
        throw new Error("Completare i campi di tutte le domande");
      }
      if (this.vettoreV1!.punteggio[i] == undefined || this.vettoreV1!.Commento[i] == "") {
        console.log("c")
        throw new Error("Completare i campi di tutte le domande");
      }
    }

    //se risposte indefinite o "" non mando i dati
    for (let i = 0; i < this.vettDati.domFinali.length; i++) {
      try {
        this.vettoreV1!.domFinali[i] = this.vettoreV1!.domFinali[i].trim();
      } catch (error) {
        console.log("d");
        throw new Error("Completare i campi di tutte le domande");
      }
      if (this.vettDati.domFinali[i] == "") {
        console.log("e");
        throw new Error("Completare i campi di tutte le domande");
      }
    }
  }*/

  invia() {
    //try {
    //this.noVuoto()
    //console.log(this.oggetto?.id);
    //console.log(this.vettoreV1?.data);
    this.vettoreV1!.id_dipendente = Number(this.nome?.substring(0, this.nome.indexOf(")")));
    return this.miohttp.post("http://localhost:8000", JSON.stringify(this.vettoreV1), { responseType: 'text' }).subscribe((data) => {
      console.log(data);
    });
    /*} catch (error) {
      alert(error);
      return 0;
    }*/
  }

  /*salvaId(idSelect: number){
    console.log("ciao");
    this.oggetto!.id = idSelect;
  }*/
}
