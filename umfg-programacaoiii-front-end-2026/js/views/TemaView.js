import { obterElemento } from "../utils/dom.js";

const CHAVE = "tema";
const TEMA_CLARO = "claro";
const TEMA_ESCURO = "escuro";

export class TemaView {
    iniciar() {
        this.#aplicar(this.#temaSalvo() ?? this.#temaDoSistema());
        obterElemento("btnTema").addEventListener("click", () => this.#alternar());
    }

    #alternar() {
        const atual = document.documentElement.dataset.tema;
        this.#aplicar(atual === TEMA_ESCURO ? TEMA_CLARO : TEMA_ESCURO);
    }

    #aplicar(tema) {
        document.documentElement.dataset.tema = tema;
        try { localStorage.setItem(CHAVE, tema); } catch { /* armazenamento indisponível */ }
    }

    #temaSalvo() {
        try { return localStorage.getItem(CHAVE); } catch { return null; }
    }

    #temaDoSistema() {
        return matchMedia("(prefers-color-scheme: dark)").matches ? TEMA_ESCURO : TEMA_CLARO;
    }
}
