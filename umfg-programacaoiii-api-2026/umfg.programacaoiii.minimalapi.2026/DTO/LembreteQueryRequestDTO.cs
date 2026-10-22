using System.ComponentModel.DataAnnotations;

namespace umfg.programacaoiii.minimalapi._2026.DTO;

public sealed class LembreteQueryRequestDTO
{
    public const string OrdemPadrao = "DataCadastro";
    public const string DirecaoPadrao = "DESC";
    public const int PaginaMaxima = 100_000;
    public const int TamanhoPaginaMaximo = 10_000;

    [Range(1, PaginaMaxima, ErrorMessage = "O número da página deve estar entre {1} e {2}.")]
    public int NumeroPagina { get; set; } = 1;

    [Range(1, TamanhoPaginaMaximo, ErrorMessage = "O tamanho da página deve estar entre {1} e {2}.")]
    public int TamanhoPagina { get; set; } = 10;

    /// <summary>Campo de ordenação: Descricao, DataCadastro, DataAtualizacao ou IsAtivo.</summary>
    public string? Ordem { get; set; } = OrdemPadrao;

    /// <summary>ASC ou DESC. Qualquer outro valor é tratado como DESC.</summary>
    public string? Direcao { get; set; } = DirecaoPadrao;

    public string? Descricao { get; set; }

    // Datas opcionais: quando nulas, o filtro correspondente não é aplicado.
    public DateTime? DataCadastroInicial { get; set; }
    public DateTime? DataCadastroFinal { get; set; }
    public DateTime? DataAtualizacaoInicial { get; set; }
    public DateTime? DataAtualizacaoFinal { get; set; }
}
