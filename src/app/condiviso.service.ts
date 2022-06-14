import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CondivisoService {

  //questionario :string | undefined;
  idQuestionario: number | undefined;
  vettDati: any;

  daValutatore = false;

  //interface datiDaPassare = { idValutatore: any; idValutato: any; idQuestionario: any }
  idDaPassare: any[] = [];


  constructor(private miohttp: HttpClient) { }

  ritornaNum(scelta: string): number {
    return Number(scelta.substring(0, scelta.indexOf(")")));
  }

  setIdQuestionario(id: number) {
    this.idQuestionario = id;
  }

  getIdQuestionario(): number {
    return this.idQuestionario!;
  }

  prendiDati(url: string): any {
    /*this.miohttp.get(url).subscribe((dati) => {
      console.log("ADAADfsdf")
      console.log(dati);
      this.vettDati = dati;
      return this.vettDati;
    });*/
    return this.miohttp.get(url);
  }

  passaDatiResponsabile(idValutatore: number, idValutato: number, idQuestionario: number, nome: string) {
    this.setIdQuestionario(idQuestionario);
    this.idDaPassare[0] = idValutato;
    this.idDaPassare[1] = idValutatore;
    this.idDaPassare[2] = nome;
  }

  daiDati(): any[]{
    return this.idDaPassare;
  }

  getDaV(): boolean {
    return this.daValutatore
  }

  setDaV(b: boolean) {
    this.daValutatore = b;
  }
}
