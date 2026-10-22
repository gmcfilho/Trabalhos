using umfg.programacaoiii.minimalapi._2026.DTO;
using umfg.programacaoiii.minimalapi._2026.Entidades;

namespace umfg.programacaoiii.minimalapi._2026.Services;

public interface ILembreteService
{
    Task<IReadOnlyList<Lembrete>> ListarAsync();
    Task<LembreteQueryResponseDTO> FiltrarAsync(LembreteQueryRequestDTO filtro);
    Task<Lembrete?> ObterPorIdAsync(Guid id);
    Task<Lembrete> CriarAsync(LembreteDTO dto);
    Task<Lembrete?> AtualizarAsync(Guid id, LembreteDTO dto);
    Task<bool> ExcluirAsync(Guid id);
}
