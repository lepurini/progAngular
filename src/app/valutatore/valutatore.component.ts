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
  vettDati5: any;

  dataScelta!: string;
  dataSenza!: string;

  mostraBtn!: boolean[];

  vNome!: string;
  nomeValutato!: string;
  nomeValutatoreSistemato!: string;

  idDipendente!: number;
  idValutatoreScelto!: number;
  idQuestionarioScelto!: number;

  ok!: boolean;
  ok2!: boolean;
  ok3!: boolean;
  ok4!: boolean;
  //ok5!: boolean;

  Mostrare = true;

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
      this.nomeValutatoreSistemato = this.vNome.substring(this.vNome.indexOf(')') + 2)
      console.log(this.url + "v/" + this.nomeValutatoreSistemato + "/" + this.idValutatoreScelto + "/" + this.idQuestionarioScelto);
      this.condiviso.prendiDati(this.url + "v/" + this.nomeValutatoreSistemato + "/" + this.idValutatoreScelto + "/" + this.idQuestionarioScelto).subscribe((data: any) => {
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

  passaDipendente(id: number, cognomenome: string) {
    this.date = [];
    //this.dataScelta != undefined;
    /*this.ok5 = */this.ok3 = this.ok4 = false;
    this.idDipendente = id;
    this.nomeValutato = cognomenome;
    console.log(this.nomeValutato);

    for (let elemento of this.vettDati2.domande) {
      if (this.idDipendente == elemento.id_dipendente) {
        this.date.push(new DomandaFine(elemento.id));
        this.date[this.date.length - 1].nota = String(elemento.data).substring(0, String(elemento.data).indexOf("T"));
        console.log(this.date[this.date.length - 1].nota);
      }
    }

    this.ok3 = true;
    //this.ok5 = true;
  }

  prendiRisposteQuestionario() {
    this.Mostrare = true;
    if (this.dataScelta != undefined) {
      this.dataSenza = this.dataScelta.substring(this.dataScelta.indexOf(")") + 1);

      const a = Number(this.dataScelta.substring(0, this.dataScelta.indexOf(")"))) - 1;
      //alert(a);
      //alert(this.date[Number(this.dataScelta.substring(0, this.dataScelta.indexOf(")"))) - 1].id_domanda);

      this.condiviso.prendiDati(this.url + "prendiRiposte/" + this.date[a /*Number(this.dataScelta.substring(0, this.dataScelta.indexOf(")"))) - 1*/].id_domanda + "/" + this.idQuestionarioScelto).subscribe((data: any) => {
        console.log(this.vettDati4 = data);
      });

      this.condiviso.prendiDati(this.url + "prendiRisposteDipendente/" + this.idDipendente + "/" + this.idQuestionarioScelto).subscribe((risposta: any) => {
        if (risposta[0] == null) {
          this.Mostrare = false;
        } else {
          this.vettDati5 = risposta;
          console.log(risposta);

          let vettoreConDomandeGiuste: any[] = [];

          /*for (let i = 0; i < this.vettDati5.length; i++) {
            let continua = true;
            /*if (this.vettDati5[i].id_domanda == this.vettDati4.domande[i].id) {
              vettoreConDomandeGiuste.push(this.vettDati5[i]);
            } else {
              vettoreConDomandeGiuste.push(null);
            }
            for (let j = 0; j < this.vettDati4.domande.length && continua; j++) {
              if (this.vettDati5[i].id_domanda == this.vettDati4.domande[j].id) {
                vettoreConDomandeGiuste.push(this.vettDati5[i]);
                continua = false;
              }
              
            }
            if (continua) {
              vettoreConDomandeGiuste.push(this.vettDati5[0]);
              vettoreConDomandeGiuste[vettoreConDomandeGiuste.length - 1].note = null;
              vettoreConDomandeGiuste[vettoreConDomandeGiuste.length - 1].punteggio = null;
            }
          }*/

          for (let i = 0; i < this.vettDati4.domande.length; i++) {
            let continua = true;

            for (let j = 0; j < this.vettDati5.length && continua; j++) {
              if (this.vettDati5[j].id_domanda == this.vettDati4.domande[i].id) {
                vettoreConDomandeGiuste.push(this.vettDati5[j]);
                continua = false;
              }
            }

            if (continua) {
              console.log(this.vettDati5[0]);
              let tmp = Object.create(this.vettDati5[0]);
              tmp.note = null;
              tmp.punteggio = null;
              vettoreConDomandeGiuste.push(tmp);
              //vettoreConDomandeGiuste[vettoreConDomandeGiuste.length - 1].note = null;
              //vettoreConDomandeGiuste[vettoreConDomandeGiuste.length - 1].punteggio = null;
              console.log(this.vettDati5[0]);
            }
          }

          console.log("quiiiiiiiiiii");
          console.log(vettoreConDomandeGiuste);

          this.vettDati5 = vettoreConDomandeGiuste;

          //this.ok4 = true;
        }
        this.ok4 = true;
      });
    }
    else {
      console.log(this.dataScelta);
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