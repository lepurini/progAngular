import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValoriValutato } from '../comune/valoriValutato';
import { Domanda } from '../comune/domanda';
import { DomandaFine } from '../comune/domandaFine';
import { CondivisoService } from '../condiviso.service';
import { Router } from '@angular/router';

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

  url = "http://localhost:8000/questionario/";

  //variabile che mostra parti della pagina solo quando sono arrivati i dati
  ok: boolean | undefined;

  giaDeciso = false;

  perFine!: boolean;

  finito!: boolean;

  //vettore contenente le domande della prima parte
  vDom1: any[] = [];
  //vettore contenente le domande della seconda parte
  vDom2: any[] = [];

  constructor(private miohttp: HttpClient, private condiviso: CondivisoService, private router: Router) { }

  ngOnInit(): void {
    this.setFinito(false);
    this.perFine = this.condiviso.getDaV();
    this.ok = false;
    this.vettoreV1 = new ValoriValutato();
    if ((this.vettoreV1!.id_questionario = this.condiviso.getIdQuestionario()) == undefined) {
      this.router.navigateByUrl('/');
    }
    else {
      if (/*this.condiviso.getDaV()*/ this.perFine) {
        let tmp = this.condiviso.daiDati();
        this.vettoreV1.id_dipendente = tmp[0];
        this.vettoreV1.id_valutatore = tmp[1];
        this.nome = tmp[2];
        this.vettoreV1.tipo = 2;
        this.giaDeciso = true;
        this.condiviso.setDaV(false);
      } /*else {
        this.router.navigateByUrl('/');
      }*/
      //this.vettoreV1!.id_questionario = this.condiviso.getIdQuestionario();

      //this.url = "http://localhost:8000/questionario/" + String(this.vettoreV1.id_questionario /*= this.condiviso.getIdQuestionario()*/);
      console.log(this.vettoreV1.id_questionario, this.vettoreV1.id_dipendente, this.vettoreV1.id_valutatore);


      this.condiviso.prendiDati(this.url + String(this.vettoreV1.id_questionario)).subscribe((data: any) => {
        this.vettDati = data;
        this.dividiDomande(this.vettDati.domande);
        /*for (let i = 0; i < this.vettDati.domande.length; i++) {
          //this.vettoreV1?.risposteDomande.push(new Domanda());
          if (this.vettDati.domande[i].tipo == 1) {
            this.vettoreV1?.risposteDomande.push(new Domanda(this.vettDati.domande[i].id));
            this.vDom1.push(this.vettDati.domande[i]);
          }
          else {
            this.vettoreV1?.domFinali.push(new DomandaFine(this.vettDati.domande[i].id));
            this.vDom2.push(this.vettDati.domande[i]);
          }
        }*/
        //dati arrivati --> possibile mostrare parti della pagina
        this.ok = true;

      })
    }

    console.log(this.vettoreV1.id_questionario, this.vettoreV1.id_dipendente, this.vettoreV1.id_valutatore);
    //richiesta al server
    /*this.miohttp.get(/*"http://localhost:8000/questionario/" + String(this.vettoreV1.id_questionario) this.url).subscribe((dati) => {
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
    });*/


    console.log(this.vettoreV1.id_questionario, this.vettoreV1.id_dipendente, this.vettoreV1.id_valutatore);
    this.valutatore = false;

    for (let index = 1; index < 6; index++) {
      this.punti.push(index);
    }
  }

  noVuoto() {
    //se nome o data non definiti non mando i dati
    if (this.vettoreV1?.data == undefined || this.nome == undefined) {
      console.log("a");
      throw new Error("Campo data o nome non compilati");
    }

    //se risposte indefinite o "" non mando i dati
    for (let i = 0; i < this.vettoreV1.risposteDomande.length; i++) {
      //console.log(this.vettoreV1!.risposteDomande[i]);
      if (this.vettoreV1!.risposteDomande[i].punteggio == undefined || this.vettoreV1!.risposteDomande[i].nota == undefined) {
        console.log("c");
        throw new Error("Completare i campi di tutti i punteggi e commenti");
      }

      this.vettoreV1.risposteDomande[i].nota = this.vettoreV1.risposteDomande[i].nota!.trim();

      if (this.vettoreV1!.risposteDomande[i].nota == "") {
        console.log("b");
        throw new Error("Caratteri inseriti nel campo commenti non validi");
      }
      /*//try {
      if (this.vettoreV1.risposteDomande[i].nota != undefined) {
        this.vettoreV1.risposteDomande[i].nota = this.vettoreV1.risposteDomande[i].nota?.trim();
      } else {
        //} catch (error) {
        console.log("b")
        //console.log(error);
        throw new Error("Completare i campi di tutte le domande lasciati vuoti");
      }
      //}
      if (this.vettoreV1!.risposteDomande[i].punteggio == undefined || this.vettoreV1!.risposteDomande[i].nota == "") {
        console.log("c")
        throw new Error("Completare i campi di tutti i punteggi e commenti");
      }*/
    }

    //se risposte indefinite o "" non mando i dati
    for (let i = 0; i < this.vettoreV1.domFinali.length; i++) {
      if (this.vettoreV1.domFinali[i].nota == undefined) {
        console.log("z");
        throw new Error("Completare tutti i campi dei commenti vuoti");
      }

      this.vettoreV1.domFinali[i].nota = this.vettoreV1.domFinali[i].nota!.trim();

      if (this.vettoreV1.domFinali[i].nota == "") {
        console.log("e");
        throw new Error("Caratteri inseriti nel campo commenti non validi");
      }
      /*//try {
      if (this.vettoreV1.domFinali[i].nota != undefined) {
        this.vettoreV1.domFinali[i].nota = this.vettoreV1.domFinali[i].nota?.trim();
      } else {
        //} catch (error) {
        console.log("d");
        throw new Error("Completare i campi di tutte le domande lasciati vuoti");
      }
      //}
      if (this.vettDati.domFinali[i] == "") {
        console.log("e");
        throw new Error("Completare i campi di tutte le domande");
      }*/
    }
  }

  invia() {
    try {
      this.noVuoto()
      console.log(this.vettoreV1?.data);
      if (/*!this.condiviso.getDaV()*/ !this.perFine) {
        this.vettoreV1!.id_dipendente = Number(this.nome?.substring(0, this.nome.indexOf(")")));
      }
      //this.vettoreV1!.id_questionario = this.condiviso.getIdQuestionario();
      return this.miohttp.post("http://localhost:8000", JSON.stringify(this.vettoreV1), { responseType: 'text' }).subscribe((data) => {
        console.log(data);
        this.condiviso.setDaV(false);
        //this.giaDeciso = false;
        this.setFinito(Boolean(data));
        //this.finito = Boolean(data);
        console.log(this.finito);
        console.log("ciao");
      });
    } catch (error) {
      //console.log(error);
      alert(error);
      return;
    }
  }

  getFinito(): boolean {
    return this.finito;
  }

  setFinito(booleano: boolean) {
    this.finito = booleano;
  }

  dividiDomande(domande: any[]) {
    for (let i = 0; i < domande.length; i++) {
      //this.vettoreV1?.risposteDomande.push(new Domanda());
      if (domande[i].tipo == 1) {
        this.vettoreV1?.risposteDomande.push(new Domanda(domande[i].id));
        this.vDom1.push(domande[i]);
      }
      else {
        this.vettoreV1?.domFinali.push(new DomandaFine(domande[i].id));
        this.vDom2.push(domande[i]);
      }
    }
  }
}
