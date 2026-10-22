import { obterElemento } from "../utils/dom.js";

export class CabecalhoView {
    aoClicarEmNovo(manipulador) {
        obterElemento("btnNovo").addEventListener("click", manipulador);
    }

    aoClicarEmImprimir(manipulador) {
        obterElemento("btnImprimir").addEventListener("click", manipulador);
    }
}
