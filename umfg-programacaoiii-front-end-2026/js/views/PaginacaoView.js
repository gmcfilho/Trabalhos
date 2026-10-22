import { JANELA_PAGINAS } from "../config.js";
import { obterElemento } from "../utils/dom.js";

export class PaginacaoView {
    #info = obterElemento("infoPagina");
    #botoes = obterElemento("botoesPagina");

    renderizar({ pagina, totalPaginas, primeiroRegistro, ultimoRegistro, total }) {
        this.#info.textContent =
            `Mostrando ${primeiroRegistro}–${ultimoRegistro} de ${total} · página ${pagina} de ${totalPaginas}`;

        const [inicio, fim] = this.#calcularJanela(pagina, totalPaginas);
        const primeira = pagina === 1;
        const ultima = pagina >= totalPaginas;

        const numeros = [];
        for (let numero = inicio; numero <= fim; numero++) {
            numeros.push(this.#criarBotao(numero, numero, { atual: numero === pagina }));
        }

        this.#botoes.replaceChildren(
            this.#criarBotao("«", 1, { desabilitado: primeira, titulo: "Primeira página" }),
            this.#criarBotao("‹", pagina - 1, { desabilitado: primeira, titulo: "Página anterior" }),
            ...numeros,
            this.#criarBotao("›", pagina + 1, { desabilitado: ultima, titulo: "Próxima página" }),
            this.#criarBotao("»", totalPaginas, { desabilitado: ultima, titulo: "Última página" }),
        );
    }

    limpar() {
        this.#info.textContent = "";
        this.#botoes.replaceChildren();
    }

    aoMudarPagina(manipulador) {
        this.#botoes.addEventListener("click", (evento) => {
            const botao = evento.target.closest("button[data-pagina]");
            if (botao && !botao.disabled) manipulador(Number(botao.dataset.pagina));
        });
    }

    #calcularJanela(pagina, totalPaginas) {
        const fim = Math.min(totalPaginas, Math.max(1, pagina - 2) + JANELA_PAGINAS - 1);
        const inicio = Math.max(1, fim - JANELA_PAGINAS + 1);
        return [inicio, fim];
    }

    #criarBotao(rotulo, pagina, { desabilitado = false, atual = false, titulo = "" } = {}) {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "pg";
        botao.textContent = rotulo;
        botao.dataset.pagina = pagina;
        botao.disabled = desabilitado;
        if (titulo) botao.title = titulo;
        if (atual) botao.setAttribute("aria-current", "page");
        return botao;
    }
}
