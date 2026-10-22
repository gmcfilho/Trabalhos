// Ponto de entrada: monta as dependências (composição) e inicia o controller.

import { API_URL, DEBUG_HTTP } from "./config.js";
import { ApiClient } from "./services/ApiClient.js";
import { LembreteService } from "./services/LembreteService.js";
import { LembreteModel } from "./models/LembreteModel.js";
import { LembreteController } from "./controllers/LembreteController.js";
import { CabecalhoView } from "./views/CabecalhoView.js";
import { FiltroView } from "./views/FiltroView.js";
import { TabelaView } from "./views/TabelaView.js";
import { PaginacaoView } from "./views/PaginacaoView.js";
import { FormularioView } from "./views/FormularioView.js";
import { ConfirmacaoExclusaoView } from "./views/ConfirmacaoExclusaoView.js";
import { NotificacaoView } from "./views/NotificacaoView.js";
import { TemaView } from "./views/TemaView.js";

const api = new ApiClient(API_URL, { debug: DEBUG_HTTP });
const model = new LembreteModel(new LembreteService(api));

const views = {
    cabecalho: new CabecalhoView(),
    filtro: new FiltroView(),
    tabela: new TabelaView(),
    paginacao: new PaginacaoView(),
    formulario: new FormularioView(),
    confirmacao: new ConfirmacaoExclusaoView(),
    notificacao: new NotificacaoView(),
    tema: new TemaView(),
};

new LembreteController(model, views).iniciar();
