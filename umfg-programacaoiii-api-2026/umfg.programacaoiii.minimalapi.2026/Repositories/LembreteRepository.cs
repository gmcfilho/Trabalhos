using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using umfg.programacaoiii.minimalapi._2026.Contexto;
using umfg.programacaoiii.minimalapi._2026.DTO;
using umfg.programacaoiii.minimalapi._2026.Entidades;

namespace umfg.programacaoiii.minimalapi._2026.Repositories;

public sealed class LembreteRepository(MySqlContexto contexto) : ILembreteRepository
{
    private const string OrdemDescricao = "descricao";
    private const string OrdemDataAtualizacao = "dataatualizacao";
    private const string OrdemStatus = "isativo";

    public async Task<IReadOnlyList<Lembrete>> ListarAtivosAsync()
    {
        return await contexto.Lembrete
            .AsNoTracking()
            .Where(x => x.IsAtivo)
            .ToListAsync();
    }

    public async Task<ResultadoPaginado<Lembrete>> FiltrarAtivosAsync(LembreteQueryRequestDTO filtro)
    {
        var consulta = AplicarFiltros(contexto.Lembrete.AsNoTracking().Where(x => x.IsAtivo), filtro);

        var total = await consulta.CountAsync();
        var itens = await AplicarOrdenacao(consulta, filtro)
            .Skip((filtro.NumeroPagina - 1) * filtro.TamanhoPagina)
            .Take(filtro.TamanhoPagina)
            .ToListAsync();

        return new ResultadoPaginado<Lembrete>(itens, total);
    }

    public Task<Lembrete?> ObterAtivoPorIdAsync(Guid id)
    {
        return contexto.Lembrete.FirstOrDefaultAsync(x => x.Id == id && x.IsAtivo);
    }

    public async Task AdicionarAsync(Lembrete lembrete)
    {
        await contexto.Lembrete.AddAsync(lembrete);
    }

    public Task SalvarAlteracoesAsync() => contexto.SaveChangesAsync();

    // ---------- filtros ----------

    private static IQueryable<Lembrete> AplicarFiltros(IQueryable<Lembrete> consulta, LembreteQueryRequestDTO filtro)
    {
        if (!string.IsNullOrWhiteSpace(filtro.Descricao))
        {
            var termo = EscaparCaracteresDoLike(filtro.Descricao);
            consulta = consulta.Where(x => EF.Functions.Like(x.Descricao, $"%{termo}%"));
        }

        if (filtro.DataCadastroInicial is { } cadastroInicial)
        {
            var inicio = cadastroInicial.Date;
            consulta = consulta.Where(x => x.DataCadastro >= inicio);
        }

        if (filtro.DataCadastroFinal is { } cadastroFinal)
        {
            var fim = FimDoDia(cadastroFinal);
            consulta = consulta.Where(x => x.DataCadastro < fim);
        }

        if (filtro.DataAtualizacaoInicial is { } atualizacaoInicial)
        {
            var inicio = atualizacaoInicial.Date;
            consulta = consulta.Where(x => x.DataAtualizacao >= inicio);
        }

        if (filtro.DataAtualizacaoFinal is { } atualizacaoFinal)
        {
            var fim = FimDoDia(atualizacaoFinal);
            consulta = consulta.Where(x => x.DataAtualizacao < fim);
        }

        return consulta;
    }

    private static string EscaparCaracteresDoLike(string termo)
    {
        return termo
            .Replace("\\", "\\\\")
            .Replace("%", "\\%")
            .Replace("_", "\\_");
    }

    /// <summary>Limite exclusivo que inclui o dia inteiro informado.</summary>
    private static DateTime FimDoDia(DateTime data)
    {
        return data.Date == DateTime.MaxValue.Date ? DateTime.MaxValue : data.Date.AddDays(1);
    }

    // ---------- ordenação ----------

    private static IOrderedQueryable<Lembrete> AplicarOrdenacao(IQueryable<Lembrete> consulta, LembreteQueryRequestDTO filtro)
    {
        var decrescente = !string.Equals(filtro.Direcao, "ASC", StringComparison.OrdinalIgnoreCase);
        var campo = (filtro.Ordem ?? LembreteQueryRequestDTO.OrdemPadrao).ToLowerInvariant();

        var ordenada = campo switch
        {
            OrdemDescricao => Ordenar(consulta, x => x.Descricao, decrescente),
            OrdemDataAtualizacao => Ordenar(consulta, x => x.DataAtualizacao, decrescente),
            OrdemStatus => Ordenar(consulta, x => x.IsAtivo, decrescente),
            _ => Ordenar(consulta, x => x.DataCadastro, decrescente),
        };

        // desempate estável: evita registros repetidos ou perdidos entre páginas
        return ordenada.ThenBy(x => x.Id);
    }

    private static IOrderedQueryable<Lembrete> Ordenar<TChave>(
        IQueryable<Lembrete> consulta, Expression<Func<Lembrete, TChave>> chave, bool decrescente)
    {
        return decrescente ? consulta.OrderByDescending(chave) : consulta.OrderBy(chave);
    }
}
