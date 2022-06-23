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

  uuid!: string;

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
    const xxx = window.location.search;
    //const y = new URLSearchParams(xxx);
    const z = new URLSearchParams(xxx);
    console.log(z.get('uuid'))
    //this.uuid != z.get('uuid');
    //var z = new URLSearchParams(xxx);
    this.perFine = this.condiviso.getDaV();
    this.ok = false;
    this.vettoreV1 = new ValoriValutato();
    this.vettoreV1.id_dipendente = Number(z.get('idDip'));
    console.log("IUIU " + this.vettoreV1.id_dipendente);
    this.vettoreV1!.id_questionario = Number(z.get('idQ'));
    console.log("parametri: " + this.uuid + " - - - " + this.vettoreV1!.id_questionario);
    if (!this.perFine && z.get('uuid') == undefined && this.vettoreV1!.id_questionario == undefined) {
      this.router.navigateByUrl('/');
    }
    else {
      if (this.perFine) {
        this.vettoreV1!.id_questionario = this.condiviso.getIdQuestionario()
        let tmp = this.condiviso.daiDati();
        this.vettoreV1.id_dipendente = tmp[0];
        this.vettoreV1.id_valutatore = tmp[1];
        console.log("IUIU " + this.vettoreV1.id_dipendente);
        this.nome = tmp[2];
        this.vettoreV1.tipo = 2;
        this.giaDeciso = true;
        this.condiviso.setDaV(false);
        //this.condiviso.setIdQuestionario(Number(undefined));
      } /*else {
        this.router.navigateByUrl('/');
      }*/
      //this.vettoreV1!.id_questionario = this.condiviso.getIdQuestionario();

      //this.url = "http://localhost:8000/questionario/" + String(this.vettoreV1.id_questionario /*= this.condiviso.getIdQuestionario()*/);
      console.log(this.vettoreV1.id_questionario, this.vettoreV1.id_dipendente, this.vettoreV1.id_valutatore);


      this.condiviso.prendiDati(this.url + String(this.vettoreV1.id_questionario)).subscribe((data: any) => {
        this.vettDati = data;
        //if (z.get('uuid') != undefined) {
        for (let i = 0; i < this.vettDati.dipendenti.length; i++) {
          //console.log(this.uuid + "             dentro           " + this.vettDati.dipendenti[i].uuid);
          if (z.get('uuid') == this.vettDati.dipendenti[i].uuid) {
            this.nome = this.vettDati.dipendenti[i].cognomenome;
            console.log(this.nome);
            break;
          }
        }
        //}
        this.dividiDomande(this.vettDati.domande);
        this.ok = true;
      });
    }

    console.log(this.vettoreV1.id_questionario, this.vettoreV1.id_dipendente, this.vettoreV1.id_valutatore);
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
    }
  }

  invia() {
    try {
      this.noVuoto()
      console.log(this.vettoreV1?.data);
      /*if (!this.perFine) {
        this.vettoreV1!.id_dipendente = Number(this.nome?.substring(0, this.nome.indexOf(")")));
      }*/
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
      if (domande[i].tipo == 1) {
        this.vettoreV1?.risposteDomande.push(new Domanda(domande[i].id));
        this.vDom1.push(domande[i]);
      }
      else if ((domande[i].tipo == 2 && this.perFine) || domande[i].tipo == 3) {
        this.vettoreV1?.domFinali.push(new DomandaFine(domande[i].id));
        this.vDom2.push(domande[i]);
      }
    }
  }
}