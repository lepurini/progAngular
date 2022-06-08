import { DomandaFine } from "./domandaFine";

export class Domanda extends DomandaFine {

    //id_domanda: number | undefined;
    //nota: string | undefined;
    punteggio: number | undefined;

    constructor(num: number) {
        //this.id_domanda = num;
        super(num);
    }
}
