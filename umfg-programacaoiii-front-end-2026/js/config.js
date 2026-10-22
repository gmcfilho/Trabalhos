// Constantes da aplicação. Nada aqui tem lógica.

// Use o endereço HTTPS da API (a API redireciona http -> https e isso quebra o CORS).
export const API_URL = "https://localhost:7063";
export const DEBUG_HTTP = true;

export const DIRECAO = Object.freeze({ ASC: "ASC", DESC: "DESC" });

export const ORDENACAO_PADRAO = Object.freeze({
    campo: "DataCadastro",
    direcao: DIRECAO.DESC,
});

export const TAMANHO_PAGINA_PADRAO = 10;
export const TAMANHO_MAXIMO_DESCRICAO = 500;

// Intervalo usado quando o usuário não preenche uma data de filtro.
// Mantém compatibilidade com versões da API que exigem as quatro datas.
export const INTERVALO_DATAS = Object.freeze({ minima: "1900-01-01", maxima: "2999-12-31" });

export const DURACAO_TOAST_MS = 3500;
export const JANELA_PAGINAS = 5;
