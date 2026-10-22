// Conhece os endpoints de lembretes e converte dados do domínio em requisições.

import { INTERVALO_DATAS } from "../config.js";

const RECURSO = "/lembretes";

export class LembreteService {
    #api;

    constructor(api) {
        this.#api = api;
    }

    async filtrar(consulta) {
        const resposta = await this.#api.obter(`${RECURSO}/filtro?${this.#montarQuery(consulta)}`);
        return resposta.json();
    }

    async obterPorId(id) {
        const resposta = await this.#api.obter(`${RECURSO}/${id}`);
        return resposta.json();
    }

    criar(descricao) {
        return this.#api.criar(RECURSO, { descricao });
    }

    atualizar(id, descricao) {
        return this.#api.atualizar(`${RECURSO}/${id}`, { descricao });
    }

    excluir(id) {
        return this.#api.remover(`${RECURSO}/${id}`);
    }

    async gerarRelatorio(consulta) {
        const resposta = await this.#api.obter(`${RECURSO}/imprimir?${this.#montarQuery(consulta)}`);
        return resposta.blob();
    }

    #montarQuery(consulta) {
        const { datas } = consulta;

        return new URLSearchParams({
            NumeroPagina: consulta.pagina,
            TamanhoPagina: consulta.tamanho,
            Ordem: consulta.ordem,
            Direcao: consulta.direcao,
            Descricao: consulta.descricao,
            DataCadastroInicial: datas.cadastroInicial || INTERVALO_DATAS.minima,
            DataCadastroFinal: datas.cadastroFinal || INTERVALO_DATAS.maxima,
            DataAtualizacaoInicial: datas.atualizacaoInicial || INTERVALO_DATAS.minima,
            DataAtualizacaoFinal: datas.atualizacaoFinal || INTERVALO_DATAS.maxima,
        });
    }
}
