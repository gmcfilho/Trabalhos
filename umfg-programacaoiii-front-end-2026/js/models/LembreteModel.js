// Estado e regras da aplicação. Não conhece o DOM.

import {
    DIRECAO, ORDENACAO_PADRAO, TAMANHO_PAGINA_PADRAO, TAMANHO_MAXIMO_DESCRICAO,
} from "../config.js";

const FILTROS_VAZIOS = Object.freeze({
    descricao: "",
    cadastroInicial: "",
    cadastroFinal: "",
    atualizacaoInicial: "",
    atualizacaoFinal: "",
});

export class LembreteModel {
    #service;

    lembretes = [];
    total = 0;
    pagina = 1;
    tamanho = TAMANHO_PAGINA_PADRAO;
    ordem = ORDENACAO_PADRAO.campo;
    direcao = ORDENACAO_PADRAO.direcao;
    filtros = { ...FILTROS_VAZIOS };

    constructor(service) {
        this.#service = service;
    }

    // ---------- consultas derivadas ----------

    get totalPaginas() {
        return Math.max(1, Math.ceil(this.total / this.tamanho));
    }

    get primeiroRegistro() {
        return this.total === 0 ? 0 : (this.pagina - 1) * this.tamanho + 1;
    }

    get ultimoRegistro() {
        return Math.min(this.pagina * this.tamanho, this.total);
    }

    // ---------- mudanças de estado ----------

    aplicarFiltros(filtros, tamanho) {
        this.filtros = { ...filtros };
        this.tamanho = tamanho;
        this.pagina = 1;
    }

    limparFiltros() {
        this.filtros = { ...FILTROS_VAZIOS };
        this.tamanho = TAMANHO_PAGINA_PADRAO;
        this.ordem = ORDENACAO_PADRAO.campo;
        this.direcao = ORDENACAO_PADRAO.direcao;
        this.pagina = 1;
    }

    ordenarPor(campo) {
        const mesmoCampo = this.ordem === campo;
        this.direcao = mesmoCampo && this.direcao === DIRECAO.ASC ? DIRECAO.DESC : DIRECAO.ASC;
        this.ordem = campo;
        this.pagina = 1;
    }

    irParaPagina(numero) {
        this.pagina = Math.min(Math.max(1, numero), this.totalPaginas);
    }

    // ---------- regras de validação (retornam a mensagem de erro ou null) ----------

    validarDescricao(texto) {
        if (!texto.trim()) return "Informe uma descrição para o lembrete.";
        if (texto.length > TAMANHO_MAXIMO_DESCRICAO) {
            return `A descrição pode ter no máximo ${TAMANHO_MAXIMO_DESCRICAO} caracteres.`;
        }
        return null;
    }

    validarFiltros(filtros) {
        if (this.#intervaloInvertido(filtros.cadastroInicial, filtros.cadastroFinal)) {
            return "Na data de cadastro, o início não pode ser maior que o fim.";
        }
        if (this.#intervaloInvertido(filtros.atualizacaoInicial, filtros.atualizacaoFinal)) {
            return "Na data de atualização, o início não pode ser maior que o fim.";
        }
        return null;
    }

    #intervaloInvertido(inicio, fim) {
        return Boolean(inicio && fim && inicio > fim);
    }

    // ---------- operações com a API ----------

    async carregar() {
        let resultado = await this.#service.filtrar(this.#consulta());

        // a última página pode ter esvaziado (ex.: após excluir o único item dela)
        this.total = resultado.total;
        if (this.pagina > this.totalPaginas) {
            this.pagina = this.totalPaginas;
            resultado = await this.#service.filtrar(this.#consulta());
        }

        this.lembretes = resultado.lembretes;
        this.total = resultado.total;
    }

    obterPorId(id) {
        return this.#service.obterPorId(id);
    }

    async salvar({ id, descricao }) {
        const texto = descricao.trim();

        if (id) {
            await this.#service.atualizar(id, texto);
            return;
        }

        await this.#service.criar(texto);
        this.pagina = 1;
    }

    excluir(id) {
        return this.#service.excluir(id);
    }

    gerarRelatorio() {
        // imprime todos os registros que atendem ao filtro e à ordenação atuais
        return this.#service.gerarRelatorio({ ...this.#consulta(), pagina: 1, tamanho: Math.max(this.total, 1) });
    }

    #consulta() {
        const { descricao, ...datas } = this.filtros;

        return {
            pagina: this.pagina,
            tamanho: this.tamanho,
            ordem: this.ordem,
            direcao: this.direcao,
            descricao: descricao.trim(),
            datas,
        };
    }
}
