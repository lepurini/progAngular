import { DomandaFine } from "./domandaFine";

export class Domanda extends DomandaFine {

    punteggio: number | undefined;

    constructor(num: number) {
        super(num);
    }
}
