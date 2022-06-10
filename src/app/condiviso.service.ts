import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CondivisoService {

  //questionario :string | undefined;
  idQuestionario: number | undefined;
  vettDati: any;

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
}
