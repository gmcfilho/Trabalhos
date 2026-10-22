// Orquestra Model e Views: recebe eventos das views, chama o model e atualiza as views.

export class LembreteController {
    #model;
    #views;
    #idParaExcluir = null;

    constructor(model, views) {
        this.#model = model;
        this.#views = views;
    }

    iniciar() {
        this.#views.tema.iniciar();
        this.#registrarEventos();
        return this.carregar();
    }

    // ---------- carregamento da lista ----------

    async carregar() {
        const { tabela } = this.#views;

        tabela.exibirCarregando(true);
        const sucesso = await this.#executar(() => this.#model.carregar(), "Não foi possível carregar os lembretes.");
        tabela.exibirCarregando(false);

        if (sucesso) this.#renderizarLista();
        else this.#limparLista();
    }

    #renderizarLista() {
        const { tabela, paginacao } = this.#views;
        const model = this.#model;

        tabela.renderizar(model.lembretes);
        tabela.exibirTotal(model.total);
        tabela.marcarOrdenacao(model.ordem, model.direcao);
        paginacao.renderizar(model);
    }

    #limparLista() {
        this.#views.tabela.limpar();
        this.#views.paginacao.limpar();
    }

    // ---------- filtros, ordenação e paginação ----------

    #aoFiltrar() {
        const filtros = this.#views.filtro.lerFiltros();
        const erro = this.#model.validarFiltros(filtros);

        if (erro) {
            this.#views.notificacao.aviso(erro);
            return;
        }

        this.#model.aplicarFiltros(filtros, this.#views.filtro.lerTamanhoPagina());
        this.carregar();
    }

    #aoLimparFiltros() {
        this.#views.filtro.limpar();
        this.#model.limparFiltros();
        this.carregar();
    }

    #aoOrdenar(campo) {
        this.#model.ordenarPor(campo);
        this.carregar();
    }

    #aoMudarPagina(numero) {
        this.#model.irParaPagina(numero);
        this.carregar();
    }

    // ---------- cadastro e edição ----------

    async #aoEditar(id) {
        const lembrete = await this.#executar(() => this.#model.obterPorId(id), "Não foi possível buscar o lembrete.");
        if (lembrete) this.#views.formulario.abrirEdicao(lembrete);
    }

    #aoDigitarDescricao(texto) {
        const { formulario } = this.#views;

        // depois de um erro exibido, valida a cada tecla para o aviso sumir assim que for corrigido
        if (formulario.estaComErro()) formulario.exibirErro(this.#model.validarDescricao(texto));
    }

    async #aoSalvar() {
        const { formulario, notificacao } = this.#views;
        const dados = formulario.ler();
        const erro = this.#model.validarDescricao(dados.descricao);

        formulario.exibirErro(erro);
        if (erro) return;

        const editando = Boolean(dados.id);
        formulario.bloquearSalvar(true);
        const sucesso = await this.#executar(
            () => this.#model.salvar(dados),
            editando ? "Não foi possível atualizar o lembrete." : "Não foi possível criar o lembrete.",
        );
        formulario.bloquearSalvar(false);

        if (!sucesso) return;

        formulario.fechar();
        notificacao.sucesso(editando ? "Lembrete atualizado com sucesso!" : "Lembrete criado com sucesso!");
        await this.carregar();
    }

    // ---------- exclusão ----------

    #aoPedirExclusao(id, descricao) {
        this.#idParaExcluir = id;
        this.#views.confirmacao.abrir(descricao);
    }

    async #aoConfirmarExclusao() {
        const id = this.#idParaExcluir;
        this.#idParaExcluir = null;
        this.#views.confirmacao.fechar();

        const sucesso = await this.#executar(() => this.#model.excluir(id), "Não foi possível excluir o lembrete.");
        if (!sucesso) return;

        this.#views.notificacao.sucesso("Lembrete excluído com sucesso!");
        await this.carregar();
    }

    // ---------- relatório ----------

    async #aoImprimir() {
        const arquivo = await this.#executar(() => this.#model.gerarRelatorio(), "Não foi possível gerar o relatório.");
        if (!arquivo) return;

        this.#baixar(arquivo, "relatorio-lembretes.pdf");
        this.#views.notificacao.sucesso("Relatório gerado com sucesso!");
    }

    #baixar(arquivo, nome) {
        const url = URL.createObjectURL(arquivo);
        const link = Object.assign(document.createElement("a"), { href: url, download: nome });

        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
    }

    // ---------- tratamento de erros ----------

    /** Executa uma ação assíncrona; devolve o resultado (ou true) e trata falhas. Em erro devolve null. */
    async #executar(acao, mensagemDeErro) {
        try {
            const resultado = await acao();
            this.#views.notificacao.ocultarAlertaApi();
            return resultado ?? true;
        } catch (erro) {
            this.#tratarErro(erro, mensagemDeErro);
            return null;
        }
    }

    #tratarErro(erro, mensagemDeErro) {
        const { notificacao, formulario } = this.#views;
        console.error(erro);

        if (erro.falhaDeRede) {
            notificacao.mostrarAlertaApi("Confira se a API está em execução e se o certificado HTTPS foi aceito.");
            notificacao.erro("Erro na comunicação com a API.");
        } else if (erro.naoEncontrado) {
            formulario.fechar();
            notificacao.aviso("Esse lembrete não existe mais.");
            this.carregar();
        } else {
            notificacao.erro(mensagemDeErro);
        }
    }

    // ---------- ligação entre views e controller ----------

    #registrarEventos() {
        const { cabecalho, filtro, tabela, paginacao, formulario, confirmacao, notificacao } = this.#views;

        filtro.aoFiltrar(() => this.#aoFiltrar());
        filtro.aoLimpar(() => this.#aoLimparFiltros());
        filtro.aoMudarTamanhoPagina(() => this.#aoFiltrar());

        tabela.aoOrdenar((campo) => this.#aoOrdenar(campo));
        tabela.aoEditar((id) => this.#aoEditar(id));
        tabela.aoExcluir((id, descricao) => this.#aoPedirExclusao(id, descricao));

        paginacao.aoMudarPagina((numero) => this.#aoMudarPagina(numero));

        cabecalho.aoClicarEmNovo(() => formulario.abrirNovo());
        cabecalho.aoClicarEmImprimir(() => this.#aoImprimir());

        formulario.aoCancelar();
        formulario.aoSalvar(() => this.#aoSalvar());
        formulario.aoDigitar((texto) => this.#aoDigitarDescricao(texto));

        confirmacao.aoConfirmar(() => this.#aoConfirmarExclusao());
        confirmacao.aoCancelar();

        notificacao.aoTentarNovamente(() => this.carregar());
    }
}
