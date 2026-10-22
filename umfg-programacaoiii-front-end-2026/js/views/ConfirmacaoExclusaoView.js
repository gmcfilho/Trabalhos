import { obterElemento } from "../utils/dom.js";
import { resumir } from "../utils/formatadores.js";

const LIMITE_TEXTO = 120;

export class ConfirmacaoExclusaoView {
    #modal = obterElemento("modalExcluir");
    #texto = obterElemento("textoExcluir");

    abrir(descricao) {
        this.#texto.textContent = `“${resumir(descricao, LIMITE_TEXTO)}” será removido da lista.`;
        this.#modal.showModal();
    }

    fechar() {
        this.#modal.close();
    }

    aoConfirmar(manipulador) {
        obterElemento("btnSimExcluir").addEventListener("click", manipulador);
    }

    aoCancelar() {
        obterElemento("btnNaoExcluir").addEventListener("click", () => this.fechar());
    }
}
