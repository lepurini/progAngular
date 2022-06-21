import { Component, OnInit } from '@angular/core';
import { DomandaFine } from '../comune/domandaFine';
import { CondivisoService } from '../condiviso.service';
import { jsPDF } from 'jspdf';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  questionarioScelto: string | undefined;
  idQuestionario!: number;

  url = "http://localhost:8000/";

  vettDati: any;
  vettDati2: any;
  vettDati3: any;

  idDipendente!: number;

  mostraBtn!: boolean[];

  dataScelta!: string;

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
    this.ok4 = this.ok3 = this.ok2 = false;
    //this.ok4 = false;
    this.date = [];
    this.mostraBtn = [];
    this.idQuestionario != undefined;
    //this.ok2 = false;

    if (this.questionarioScelto != undefined) {
      this.idQuestionario = this.condiviso.ritornaNum(this.questionarioScelto);
      this.condiviso.prendiDati(this.url + "valutatore/" + this.idQuestionario/*this.condiviso.ritornaNum(this.questionarioScelto)*/).subscribe((data: any) => {
        console.log(data);
        this.vettDati2 = data;
        for (let element of this.vettDati2.dipendenti) {
          this.mostraBtn.push(this.controllaUtentiQuestionari(element.id));
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

  passaDipendente(id: number, responsabile: string) {
    this.date = [];
    this.ok4 = this.ok3 = false;
    //this.ok4 = false;
    this.idDipendente = id;

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

      this.condiviso.prendiDati(this.url + "prendiRiposte/" + this.date[Number(this.dataScelta.substring(0, this.dataScelta.indexOf(")"))) - 1].id_domanda + "/" + this.idQuestionario).subscribe((data: any) => {
        console.log(this.vettDati3 = data);
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
