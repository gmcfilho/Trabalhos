using System.ComponentModel.DataAnnotations;
using umfg.programacaoiii.minimalapi._2026.Entidades;

namespace umfg.programacaoiii.minimalapi._2026.DTO;

public sealed class LembreteDTO
{
    [Required(ErrorMessage = "A descrição é obrigatória.")]
    [StringLength(Lembrete.TamanhoMaximoDescricao, ErrorMessage = "A descrição pode ter no máximo {1} caracteres.")]
    public string Descricao { get; set; } = string.Empty;
}
