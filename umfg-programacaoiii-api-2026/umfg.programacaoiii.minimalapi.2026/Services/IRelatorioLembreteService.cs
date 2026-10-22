using umfg.programacaoiii.minimalapi._2026.Entidades;

namespace umfg.programacaoiii.minimalapi._2026.Services;

public interface IRelatorioLembreteService
{
    byte[] GerarPdf(IReadOnlyList<Lembrete> lembretes);
}
