// Responsável somente por falar HTTP: monta a requisição, trata falhas e
// converte tudo em ErroApi. Não conhece lembretes.

export class ErroApi extends Error {
    constructor(mensagem, { status = 0, falhaDeRede = false } = {}) {
        super(mensagem);
        this.name = "ErroApi";
        this.status = status;
        this.falhaDeRede = falhaDeRede;
    }

    get naoEncontrado() {
        return this.status === 404;
    }
}

export class ApiClient {
    #urlBase;
    #debug;

    constructor(urlBase, { debug = false } = {}) {
        this.#urlBase = urlBase;
        this.#debug = debug;
    }

    obter(caminho) {
        return this.#enviar("GET", caminho);
    }

    criar(caminho, corpo) {
        return this.#enviar("POST", caminho, corpo);
    }

    atualizar(caminho, corpo) {
        return this.#enviar("PUT", caminho, corpo);
    }

    remover(caminho) {
        return this.#enviar("DELETE", caminho);
    }

    async #enviar(metodo, caminho, corpo) {
        const url = `${this.#urlBase}${caminho}`;
        const opcoes = this.#montarOpcoes(metodo, corpo);
        this.#registrar(`${metodo} ${url}`, corpo);

        const resposta = await this.#executar(url, opcoes);
        this.#registrar(`← ${resposta.status} ${resposta.statusText}`);

        if (!resposta.ok) throw await this.#criarErro(resposta);
        return resposta;
    }

    #montarOpcoes(metodo, corpo) {
        if (corpo === undefined) return { method: metodo };

        return {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo),
        };
    }

    async #executar(url, opcoes) {
        try {
            return await fetch(url, opcoes);
        } catch {
            // fetch só rejeita em falha de rede, CORS ou certificado
            throw new ErroApi("Sem conexão com a API.", { falhaDeRede: true });
        }
    }

    async #criarErro(resposta) {
        const detalhe = await resposta.text().catch(() => "");
        return new ErroApi(detalhe || `Erro ${resposta.status}`, { status: resposta.status });
    }

    #registrar(mensagem, corpo = "") {
        if (this.#debug) console.log(`[HTTP] ${mensagem}`, corpo);
    }
}
