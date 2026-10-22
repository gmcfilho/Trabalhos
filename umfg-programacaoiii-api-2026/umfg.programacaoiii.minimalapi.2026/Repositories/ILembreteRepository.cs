using umfg.programacaoiii.minimalapi._2026.DTO;
using umfg.programacaoiii.minimalapi._2026.Entidades;

namespace umfg.programacaoiii.minimalapi._2026.Repositories;

public interface ILembreteRepository
{
    Task<IReadOnlyList<Lembrete>> ListarAtivosAsync();
    Task<ResultadoPaginado<Lembrete>> FiltrarAtivosAsync(LembreteQueryRequestDTO filtro);
    Task<Lembrete?> ObterAtivoPorIdAsync(Guid id);
    Task AdicionarAsync(Lembrete lembrete);
    Task SalvarAlteracoesAsync();
}
