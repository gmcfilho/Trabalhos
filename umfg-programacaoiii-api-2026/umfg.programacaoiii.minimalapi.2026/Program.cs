using QuestPDF.Infrastructure;
using umfg.programacaoiii.minimalapi._2026.Configuracoes;

namespace umfg.programacaoiii.minimalapi._2026;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.AddBancoDeDados(builder.Configuration);
        builder.Services.AddCorsParaFrontend();
        builder.Services.AddServicosDaAplicacao();

        QuestPDF.Settings.License = LicenseType.Community;

        var app = builder.Build();

        app.UseHttpsRedirection();
        app.UseCors(ServiceCollectionExtensions.PoliticaCorsFrontend);
        app.MapControllers();

        app.Run();
    }
}
