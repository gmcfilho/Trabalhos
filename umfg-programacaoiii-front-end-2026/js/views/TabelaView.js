import { DIRECAO } from "../config.js";
import { escaparHtml, obterElemento } from "../utils/dom.js";
import { formatarDataHora } from "../utils/formatadores.js";

const ARIA_SORT = Object.freeze({ [DIRECAO.ASC]: "ascending", [DIRECAO.DESC]: "descending" });

export class TabelaView {
    #tabela = obterElemento("tabela");
    #corpo = obterElemento("listaLembretes");
    #mensagemVazia = obterElemento("mensagemVazia");
    #carregando = obterElemento("carregando");
    #total = obterElemento("totalRegistros");

    renderizar(lembretes) {
        this.#corpo.replaceChildren(...lembretes.map((lembrete) => this.#criarLinha(lembrete)));
        this.#mensagemVazia.classList.toggle("hidden", lembretes.length > 0);
    }

    limpar() {
        this.#corpo.replaceChildren();
        this.#mensagemVazia.classList.add("hidden");
        this.#total.textContent = "— registros";
    }

    exibirTotal(total) {
        this.#total.textContent = `${total} ${total === 1 ? "registro" : "registros"}`;
    }

    exibirCarregando(carregando) {
        this.#carregando.classList.toggle("hidden", !carregando);
        if (carregando) this.#mensagemVazia.classList.add("hidden");
    }

    marcarOrdenacao(campo, direcao) {
        this.#tabela.querySelectorAll("th[data-campo]").forEach((coluna) => {
            const ativa = coluna.dataset.campo === campo;
            coluna.setAttribute("aria-sort", ativa ? ARIA_SORT[direcao] : "none");
        });
    }

    aoOrdenar(manipulador) {
        this.#tabela.querySelector("thead").addEventListener("click", (evento) => {
            const coluna = evento.target.closest("th[data-campo]");
            if (coluna) manipulador(coluna.dataset.campo);
        });
    }

    aoEditar(manipulador) {
        this.#aoClicarNaAcao("editar", (botao) => manipulador(botao.dataset.id));
    }

    aoExcluir(manipulador) {
        this.#aoClicarNaAcao("excluir", (botao) => {
            manipulador(botao.dataset.id, botao.closest("tr").dataset.descricao);
        });
    }

    #aoClicarNaAcao(acao, manipulador) {
        this.#corpo.addEventListener("click", (evento) => {
            const botao = evento.target.closest(`button[data-acao="${acao}"]`);
            if (botao) manipulador(botao);
        });
    }

    #criarLinha(lembrete) {
        const linha = document.createElement("tr");
        linha.dataset.descricao = lembrete.descricao;
        linha.innerHTML = `
            <td class="desc" data-label="Descrição">${escaparHtml(lembrete.descricao)}</td>
            <td class="data" data-label="Cadastro">${formatarDataHora(lembrete.dataCadastro)}</td>
            <td class="data" data-label="Atualização">${formatarDataHora(lembrete.dataAtualizacao)}</td>
            <td data-label="Status">${this.#criarStatus(lembrete.isAtivo)}</td>
            <td class="col-acoes">
                <div class="acoes">
                    <button class="btn btn--editar" data-acao="editar" data-id="${lembrete.id}" type="button">Editar</button>
                    <button class="btn btn--excluir" data-acao="excluir" data-id="${lembrete.id}" type="button">Excluir</button>
                </div>
            </td>`;
        return linha;
    }

    #criarStatus(ativo) {
        const classe = ativo ? "status--ativo" : "status--inativo";
        return `<span class="status ${classe}">${ativo ? "Ativo" : "Inativo"}</span>`;
    }
}
