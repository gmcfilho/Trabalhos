using umfg.programacaoiii.minimalapi._2026.Entidades;

namespace umfg.programacaoiii.minimalapi._2026.DTO;

public sealed class LembreteQueryResponseDTO
{
    public IReadOnlyList<Lembrete> Lembretes { get; init; } = [];
    public long Total { get; init; }
    public int NumeroPagina { get; init; }
    public int TamanhoPagina { get; init; }
}
