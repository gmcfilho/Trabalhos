using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using umfg.programacaoiii.minimalapi._2026.Entidades;

namespace umfg.programacaoiii.minimalapi._2026.Services;

public sealed class RelatorioLembreteService : IRelatorioLembreteService
{
    private const string FormatoData = "dd/MM/yyyy HH:mm";

    public byte[] GerarPdf(IReadOnlyList<Lembrete> lembretes)
    {
        var documento = Document.Create(container =>
            container.Page(pagina => ComporPagina(pagina, lembretes)));

        return documento.GeneratePdf();
    }

    private static void ComporPagina(PageDescriptor pagina, IReadOnlyList<Lembrete> lembretes)
    {
        pagina.Size(PageSizes.A4);
        pagina.Margin(2, Unit.Centimetre);
        pagina.PageColor(Colors.White);

        pagina.Header()
            .Text("Relatório de Lembretes")
            .SemiBold()
            .FontSize(20)
            .FontColor(Colors.Blue.Medium);

        pagina.Content()
            .PaddingVertical(10)
            .Column(coluna =>
            {
                coluna.Spacing(10);
                coluna.Item().Text($"Gerado em: {DateTime.Now.ToString(FormatoData)}");
                coluna.Item().Table(tabela => ComporTabela(tabela, lembretes));
            });

        pagina.Footer().AlignCenter().Text(texto => texto.CurrentPageNumber());
    }

    private static void ComporTabela(TableDescriptor tabela, IReadOnlyList<Lembrete> lembretes)
    {
        tabela.ColumnsDefinition(colunas =>
        {
            colunas.RelativeColumn();
            colunas.ConstantColumn(110);
            colunas.ConstantColumn(110);
            colunas.ConstantColumn(80);
        });

        tabela.Header(cabecalho =>
        {
            cabecalho.Cell().Text("Descrição").SemiBold();
            cabecalho.Cell().Text("Cadastro").SemiBold();
            cabecalho.Cell().Text("Atualização").SemiBold();
            cabecalho.Cell().Text("Status").SemiBold();
        });

        foreach (var lembrete in lembretes)
        {
            tabela.Cell().Text(lembrete.Descricao).FontSize(10);
            tabela.Cell().Text(lembrete.DataCadastro.ToString(FormatoData)).FontSize(10);
            tabela.Cell().Text(lembrete.DataAtualizacao.ToString(FormatoData)).FontSize(10);
            tabela.Cell()
                .Text(lembrete.IsAtivo ? "Ativo" : "Inativo")
                .FontSize(10)
                .FontColor(lembrete.IsAtivo ? Colors.Green.Medium : Colors.Red.Medium);
        }
    }
}
