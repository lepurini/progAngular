import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CondivisoService } from '../condiviso.service';

@Component({
  selector: 'app-pag-iniziale',
  templateUrl: './pag-iniziale.component.html',
  styleUrls: ['./pag-iniziale.component.css']
})
export class PagInizialeComponent implements OnInit {

  @Input() mostra: boolean | undefined;

  vettDati: any;
  url = "http://localhost:8000/init";
  questionarioScelto: string | undefined;

  ok: boolean | undefined;

  nonConsentito!: boolean;

  constructor(/*private miohttp: HttpClient,*/ private router: Router, private condiviso: CondivisoService) { }

  ngOnInit(): void {
    this.ok = false;
    const xxx = window.location.search;
    const z = new URLSearchParams(xxx);
    //this.miohttp.get("http://localhost:8000/init").subscribe((dati) => {
    //console.log("ADAADfsdf")
    //console.log(dati);
    //this.vettDati = dati;
    //controllo per dividere le domande con descrizione da quelle che vanno in fondo
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
    //this.ok = true;
    //});
    //this.vettDati = this.condiviso.prendiDati(this.url);
    if (z.get('uuid') == undefined) {
      this.nonConsentito = true;
    } else {
      this.condiviso.prendiDati(this.url).subscribe((data: any) => {
        this.vettDati = data;
        //console.log(this.vettDati[1] + "ciaooiuoiu");
        this.ok = true;
      });
    }
  }

  compila() {
    if (this.questionarioScelto != undefined) {
      this.condiviso.setIdQuestionario(this.condiviso.ritornaNum(this.questionarioScelto));
      this.router.navigateByUrl('/questionario');
    }
    else { alert("Scegliere un questionario"); }
  }

  /*metodoFigo(scelta: string): number {
    return this.condiviso.ritornaNum(scelta);
  }*/
}
