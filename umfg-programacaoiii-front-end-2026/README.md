# Caderno de Lembretes — Front-end

Atividade de Programação III (UMFG 2026). Front-end em HTML + CSS + JavaScript puro que consome a Minimal API de lembretes.

## Como executar
1. Suba o MySQL e a API (`dotnet run --launch-profile https` na pasta do projeto da API → `https://localhost:7063`).
2. Se necessário, ajuste `API_URL` no topo de `js/main.js`.
3. Sirva o front (ex.: extensão *Live Server* do VS Code, ou `python -m http.server 5500`) e abra `http://localhost:5500`.

## Funcionalidades
- CRUD completo (GET por id, POST, PUT, DELETE) e relatório em PDF (respeita filtros e ordenação).
- Filtros: descrição, cadastro inicial/final, atualização inicial/final.
- Paginação (primeira/anterior/números/próxima/última) e tamanho de página.
- Ordenação ao clicar no título da coluna (alterna ASC/DESC, com indicador visual).
- Mensagens: erro de comunicação, nenhum registro, campo obrigatório, validação de intervalo de datas, sucesso.
- Layout responsivo (tabela vira cartões no celular), tema claro/escuro.
- Descrições escapadas antes de ir para o HTML (evita XSS).

## Observações sobre a API
- `UseHttpsRedirection` + CORS: use a URL **https** da API.
- Os valores padrão das datas no `LembreteQueryRequestDTO` são inconsistentes, então o front sempre envia as 4 datas (`1900-01-01` a `2999-12-31` quando vazias).
- A ordenação só funciona com a API refatorada (a original ordenava por uma constante).

## Arquitetura (MVC em JavaScript puro)
```
js/
  main.js                      composição: cria e conecta as peças
  config.js                    constantes
  models/LembreteModel.js      estado (página, filtros, ordenação) e regras de validação
  views/                       cada view cuida de UM pedaço do DOM e só expõe eventos
    CabecalhoView · FiltroView · TabelaView · PaginacaoView
    FormularioView · ConfirmacaoExclusaoView · NotificacaoView · TemaView
  controllers/LembreteController.js   recebe eventos das views, usa o model, atualiza as views
  services/ApiClient.js        HTTP genérico (erros → ErroApi)
  services/LembreteService.js  endpoints de /lembretes
  utils/                       funções puras (escape de HTML, formatação)
```
O model não conhece o DOM; as views não conhecem a API; só o controller liga as duas partes.
> Como usa módulos ES (`type="module"`), abra por um servidor local (Live Server / `python -m http.server`), não com duplo clique no arquivo.
