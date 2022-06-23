import { Component, Input, OnInit } from '@angular/core';
import { DomandaFine } from '../comune/domandaFine';
import { CondivisoService } from '../condiviso.service';
import { FormsModule } from '@angular/forms';
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
    const xxx = window.location.search;
    //y= new URLSearchParams(xxx)
    //y.get('sdfasdf')
    console.log("parametri: " + xxx);
    //const urlParams = new URLSearchParams(queryString);
    //const code = urlParams.get('code')



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
      this.condiviso.prendiDati(this.url + "valutatore/" + this.idQuestionario).subscribe((data: any) => {
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

  prova(nome: string, idDip: number) {
    alert("http://localhost:4200/questionario?uuid=" + nome + "&idQ=" + this.idQuestionario + "&idDip="  + idDip);
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
        // console.log("passaDipendente");
        // console.log(this.date[this.date.length - 1].nota);
        // console.log(this.dataScelta);
      }
    }

    this.ok3 = true;
  }

  prendiRisposteQuestionario() {
    if (this.dataScelta != undefined) {
      const a = Number(this.dataScelta.substring(0, this.dataScelta.indexOf(")"))) - 1;

      this.condiviso.prendiDati(this.url + "prendiRiposte/" + this.date[Number(this.dataScelta.substring(0, this.dataScelta.indexOf(")"))) - 1].id_domanda + "/" + this.idQuestionario).subscribe((data: any) => {
        console.log("dopo prendiDati");
        console.log(this.vettDati3 = data);

        let vettoreConDomandeGiuste: any[] = [];

        for (let i = 0; i < this.vettDati3.dipendenti.length; i++) {
          for (let j = 0; j < this.vettDati3.domande.length; j++) {
            if (this.vettDati3.dipendenti[i].id_domanda == this.vettDati3.domande[j].id) {
              vettoreConDomandeGiuste.push(this.vettDati3.domande[j]);
              break;
            }
          }
        }

        console.log(this.vettDati3.domande = vettoreConDomandeGiuste);
        this.ok4 = true;
      });
    }
    else {
      console.log("richieste risposte questionario");
      console.log(this.dataScelta);
      console.log(this.date);
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
