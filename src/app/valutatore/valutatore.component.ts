import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomandaFine } from '../comune/domandaFine';
import { CondivisoService } from '../condiviso.service';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';


@Component({
  selector: 'app-valutatore',
  templateUrl: './valutatore.component.html',
  styleUrls: ['./valutatore.component.css']
})
export class ValutatoreComponent implements OnInit {

  questionarioScelto!: string;

  url = "http://localhost:8000/";

  vettDati: any;
  vettDati2: any;
  vettDati3: any;
  vettDati4: any;

  dataScelta!: string;

  mostraBtn!: boolean[];

  vNome!: string;

  idDipendente!: number;
  idValutatoreScelto!: number;
  idQuestionarioScelto!: number;

  ok!: boolean;
  ok2!: boolean;
  ok3!: boolean;
  ok4!: boolean;

  date: DomandaFine[] = [];

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
    this.ok2 = this.ok3 = this.ok4 = false;

    if (this.questionarioScelto != undefined && this.vNome != undefined) {
      this.idValutatoreScelto = this.condiviso.ritornaNum(this.vNome);
      this.idQuestionarioScelto = this.condiviso.ritornaNum(this.questionarioScelto);
      //this.url + this.condiviso.ritornaNum(this.questionarioScelto)
      //console.log(this.vNome.substring(this.vNome.indexOf(')')+ 1));
      console.log("Bubbbba ------ " + this.url + "v/" + this.vNome.substring(this.vNome.indexOf(')') + 2) + "/" + this.idValutatoreScelto/*this.condiviso.ritornaNum(this.vNome)*/ + "/" + this.idQuestionarioScelto/*this.condiviso.ritornaNum(this.questionarioScelto)*/);
      this.condiviso.prendiDati(this.url + "v/" + this.vNome.substring(this.vNome.indexOf(')') + 2) + "/" + /*this.condiviso.ritornaNum(this.vNome)*/ this.idValutatoreScelto + "/" + this.idQuestionarioScelto/*this.condiviso.ritornaNum(this.questionarioScelto)*/).subscribe((data: any) => {
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

  passaDipendente(id: number) {
    this.date = [];
    this.ok3 = false;
    this.ok4 = false;
    this.idDipendente = id;
    //this.idQuestionario!= undefined;
    //alert(this.idDipendente);

    for (let elemento of this.vettDati2.domande) {
      if (this.idDipendente == elemento.id_dipendente) {
        this.date.push(new DomandaFine(elemento.id));
        this.date[this.date.length - 1].nota = String(elemento.data).substring(0, String(elemento.data).indexOf("T"));
        console.log(this.date[this.date.length - 1].nota);
      }
    }

    this.ok3 = true;
  }

  prendiRisposteQuestionario() {
    if (this.dataScelta != undefined) {
      const a = Number(this.dataScelta.substring(0, this.dataScelta.indexOf(")"))) - 1;
      alert(a);
      alert(this.date[Number(this.dataScelta.substring(0, this.dataScelta.indexOf(")"))) - 1].id_domanda);

      this.condiviso.prendiDati(this.url + "prendiRiposte/" + this.date[Number(this.dataScelta.substring(0, this.dataScelta.indexOf(")"))) - 1].id_domanda + "/" + this.idQuestionarioScelto).subscribe((data: any) => {
        console.log(this.vettDati4 = data);
        this.ok4 = true;
      });
    }
    else {
      alert("Scegliere una data");
    }
  }

  toPdf() {
    const dashboard = document.getElementById('dashboard');

    const dashboardHeight = dashboard!.clientHeight;
    const dashboardWidth = dashboard!.clientWidth;
    const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };

    domtoimage.toPng(dashboard!, options).then((imgData) => {
      const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save('documento.pdf');
    });
  }
}