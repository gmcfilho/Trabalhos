import { TAMANHO_MAXIMO_DESCRICAO } from "../config.js";
import { obterElemento } from "../utils/dom.js";

export class FormularioView {
    #modal = obterElemento("modalForm");
    #form = obterElemento("formLembrete");
    #titulo = obterElemento("tituloFormulario");
    #id = obterElemento("lembreteId");
    #descricao = obterElemento("descricao");
    #erro = obterElemento("erroDescricao");
    #contador = obterElemento("contadorDescricao");
    #btnSalvar = obterElemento("btnSalvar");

    abrirNovo() {
        this.#abrir({ titulo: "Novo lembrete", id: "", descricao: "" });
    }

    abrirEdicao(lembrete) {
        this.#abrir({ titulo: "Editar lembrete", id: lembrete.id, descricao: lembrete.descricao });
    }

    fechar() {
        this.#modal.close();
    }

    ler() {
        return { id: this.#id.value, descricao: this.#descricao.value };
    }

    exibirErro(mensagem) {
        this.#erro.textContent = mensagem ?? "";
        this.#descricao.closest(".campo").classList.toggle("campo--invalido", Boolean(mensagem));
    }

    estaComErro() {
        return this.#erro.textContent !== "";
    }

    bloquearSalvar(bloqueado) {
        this.#btnSalvar.disabled = bloqueado;
    }

    aoSalvar(manipulador) {
        this.#form.addEventListener("submit", (evento) => {
            evento.preventDefault();
            manipulador();
        });
    }

    aoDigitar(manipulador) {
        this.#descricao.addEventListener("input", () => {
            this.#atualizarContador();
            manipulador(this.#descricao.value);
        });
    }

    aoCancelar() {
        obterElemento("btnCancelar").addEventListener("click", () => this.fechar());
    }

    #abrir({ titulo, id, descricao }) {
        this.#titulo.textContent = titulo;
        this.#id.value = id;
        this.#descricao.value = descricao;
        this.exibirErro(null);
        this.#atualizarContador();
        this.#modal.showModal();
        this.#descricao.focus();
    }

    #atualizarContador() {
        this.#contador.textContent = `${this.#descricao.value.length}/${TAMANHO_MAXIMO_DESCRICAO}`;
    }
}
