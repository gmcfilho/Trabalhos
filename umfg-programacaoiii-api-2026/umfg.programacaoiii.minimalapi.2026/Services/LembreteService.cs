using umfg.programacaoiii.minimalapi._2026.DTO;
using umfg.programacaoiii.minimalapi._2026.Entidades;
using umfg.programacaoiii.minimalapi._2026.Repositories;

namespace umfg.programacaoiii.minimalapi._2026.Services;

public sealed class LembreteService(ILembreteRepository repositorio) : ILembreteService
{
    public Task<IReadOnlyList<Lembrete>> ListarAsync() => repositorio.ListarAtivosAsync();

    public async Task<LembreteQueryResponseDTO> FiltrarAsync(LembreteQueryRequestDTO filtro)
    {
        var resultado = await repositorio.FiltrarAtivosAsync(filtro);

        return new LembreteQueryResponseDTO
        {
            Lembretes = resultado.Itens,
            Total = resultado.Total,
            NumeroPagina = filtro.NumeroPagina,
            TamanhoPagina = filtro.TamanhoPagina,
        };
    }

    public Task<Lembrete?> ObterPorIdAsync(Guid id) => repositorio.ObterAtivoPorIdAsync(id);

    public async Task<Lembrete> CriarAsync(LembreteDTO dto)
    {
        var lembrete = new Lembrete(dto.Descricao);

        await repositorio.AdicionarAsync(lembrete);
        await repositorio.SalvarAlteracoesAsync();

        return lembrete;
    }

    public async Task<Lembrete?> AtualizarAsync(Guid id, LembreteDTO dto)
    {
        var lembrete = await repositorio.ObterAtivoPorIdAsync(id);
        if (lembrete is null) return null;

        lembrete.AtualizarDescricao(dto.Descricao);
        await repositorio.SalvarAlteracoesAsync();

        return lembrete;
    }

    public async Task<bool> ExcluirAsync(Guid id)
    {
        var lembrete = await repositorio.ObterAtivoPorIdAsync(id);
        if (lembrete is null) return false;

        // exclusão lógica: o registro permanece no banco, apenas inativo
        lembrete.Inativar();
        await repositorio.SalvarAlteracoesAsync();

        return true;
    }
}
