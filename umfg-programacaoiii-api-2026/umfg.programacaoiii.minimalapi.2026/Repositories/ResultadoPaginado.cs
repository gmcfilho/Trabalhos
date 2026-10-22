namespace umfg.programacaoiii.minimalapi._2026.Repositories;

public sealed record ResultadoPaginado<T>(IReadOnlyList<T> Itens, long Total);
