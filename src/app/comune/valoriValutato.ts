import { Domanda } from "./domanda";
import { DomandaFine } from "./domandaFine";

export class ValoriValutato {

    //punteggio: number[] = [];
    //Commento: string[] = [];
    domFinali: DomandaFine[] = [];
    risposteDomande: Domanda[] = [];

    
    valutatore: string | undefined;
    data: Date | undefined;
    id_dipendente: number | undefined;
    tipo = 1;
    id_questionario: number | undefined;

    constructor() {
    }
}
