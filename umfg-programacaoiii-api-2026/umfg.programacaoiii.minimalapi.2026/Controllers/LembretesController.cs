using Microsoft.AspNetCore.Mvc;
using umfg.programacaoiii.minimalapi._2026.DTO;
using umfg.programacaoiii.minimalapi._2026.Entidades;
using umfg.programacaoiii.minimalapi._2026.Services;

namespace umfg.programacaoiii.minimalapi._2026.Controllers;

/// <summary>
/// Camada HTTP: recebe a requisição, delega ao serviço e traduz o resultado em status code.
/// [ApiController] valida os DTOs automaticamente e responde 400 quando inválidos.
/// </summary>
[ApiController]
[Route("lembretes")]
public sealed class LembretesController(
    ILembreteService lembreteService,
    IRelatorioLembreteService relatorioService) : ControllerBase
{
    private const string NomeArquivoRelatorio = "relatorio-lembretes.pdf";

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Lembrete>>> Listar()
    {
        return Ok(await lembreteService.ListarAsync());
    }

    [HttpGet("filtro")]
    public async Task<ActionResult<LembreteQueryResponseDTO>> Filtrar([FromQuery] LembreteQueryRequestDTO filtro)
    {
        return Ok(await lembreteService.FiltrarAsync(filtro));
    }

    [HttpGet("imprimir")]
    public async Task<IActionResult> Imprimir([FromQuery] LembreteQueryRequestDTO filtro)
    {
        var resultado = await lembreteService.FiltrarAsync(filtro);
        var pdf = relatorioService.GerarPdf(resultado.Lembretes);

        return File(pdf, "application/pdf", NomeArquivoRelatorio);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Lembrete>> ObterPorId(Guid id)
    {
        var lembrete = await lembreteService.ObterPorIdAsync(id);

        return lembrete is null ? NotFound() : Ok(lembrete);
    }

    [HttpPost]
    public async Task<ActionResult<Lembrete>> Criar(LembreteDTO dto)
    {
        var lembrete = await lembreteService.CriarAsync(dto);

        return CreatedAtAction(nameof(ObterPorId), new { id = lembrete.Id }, lembrete);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<Lembrete>> Atualizar(Guid id, LembreteDTO dto)
    {
        var lembrete = await lembreteService.AtualizarAsync(id, dto);

        return lembrete is null ? NotFound() : Ok(lembrete);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Excluir(Guid id)
    {
        var excluido = await lembreteService.ExcluirAsync(id);

        return excluido ? NoContent() : NotFound();
    }
}
