import { obterElemento } from "../utils/dom.js";

export class FiltroView {
    #form = obterElemento("formFiltro");
    #descricao = obterElemento("filtroDescricao");
    #tamanho = obterElemento("tamanhoPagina");
    #cadastroInicial = obterElemento("cadastroInicial");
    #cadastroFinal = obterElemento("cadastroFinal");
    #atualizacaoInicial = obterElemento("atualizacaoInicial");
    #atualizacaoFinal = obterElemento("atualizacaoFinal");

    lerFiltros() {
        return {
            descricao: this.#descricao.value,
            cadastroInicial: this.#cadastroInicial.value,
            cadastroFinal: this.#cadastroFinal.value,
            atualizacaoInicial: this.#atualizacaoInicial.value,
            atualizacaoFinal: this.#atualizacaoFinal.value,
        };
    }

    lerTamanhoPagina() {
        return Number(this.#tamanho.value);
    }

    limpar() {
        this.#form.reset();
    }

    focarCampoDeData(campo) {
        const campos = {
            cadastro: this.#cadastroInicial,
            atualizacao: this.#atualizacaoInicial,
        };
        campos[campo]?.focus();
    }

    aoFiltrar(manipulador) {
        this.#form.addEventListener("submit", (evento) => {
            evento.preventDefault();
            manipulador();
        });
    }

    aoLimpar(manipulador) {
        obterElemento("btnLimpar").addEventListener("click", manipulador);
    }

    aoMudarTamanhoPagina(manipulador) {
        this.#tamanho.addEventListener("change", manipulador);
    }
}
