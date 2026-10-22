import { DURACAO_TOAST_MS } from "../config.js";
import { obterElemento } from "../utils/dom.js";

export class NotificacaoView {
    #toasts = obterElemento("toasts");
    #alertaApi = obterElemento("alertaApi");
    #alertaApiTexto = obterElemento("alertaApiTexto");

    sucesso(mensagem) {
        this.#exibir(mensagem, "sucesso");
    }

    aviso(mensagem) {
        this.#exibir(mensagem, "aviso");
    }

    erro(mensagem) {
        this.#exibir(mensagem, "erro");
    }

    mostrarAlertaApi(detalhe) {
        this.#alertaApiTexto.textContent = detalhe;
        this.#alertaApi.classList.remove("hidden");
    }

    ocultarAlertaApi() {
        this.#alertaApi.classList.add("hidden");
    }

    aoTentarNovamente(manipulador) {
        obterElemento("btnTentarNovamente").addEventListener("click", manipulador);
    }

    #exibir(mensagem, tipo) {
        const toast = document.createElement("div");
        toast.className = `toast toast--${tipo}`;
        toast.textContent = mensagem;
        this.#toasts.appendChild(toast);
        setTimeout(() => toast.remove(), DURACAO_TOAST_MS);
    }
}
