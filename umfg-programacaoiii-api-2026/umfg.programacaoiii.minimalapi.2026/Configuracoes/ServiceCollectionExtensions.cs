using Microsoft.EntityFrameworkCore;
using umfg.programacaoiii.minimalapi._2026.Contexto;
using umfg.programacaoiii.minimalapi._2026.Repositories;
using umfg.programacaoiii.minimalapi._2026.Services;

namespace umfg.programacaoiii.minimalapi._2026.Configuracoes;

public static class ServiceCollectionExtensions
{
    public const string PoliticaCorsFrontend = "Frontend";

    public static IServiceCollection AddBancoDeDados(this IServiceCollection services, IConfiguration configuracao)
    {
        var stringDeConexao = configuracao["ConnectionString"] ?? string.Empty;

        return services.AddDbContext<MySqlContexto>(opcoes => opcoes.UseMySQL(stringDeConexao));
    }

    /// <summary>
    /// Libera o front-end (origem diferente) a chamar a API.
    /// No mundo real, restrinja ao domínio conhecido: .WithOrigins("https://app.empresa.com.br")
    /// </summary>
    public static IServiceCollection AddCorsParaFrontend(this IServiceCollection services)
    {
        return services.AddCors(opcoes =>
            opcoes.AddPolicy(PoliticaCorsFrontend, politica => politica
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod()));
    }

    public static IServiceCollection AddServicosDaAplicacao(this IServiceCollection services)
    {
        return services
            .AddScoped<ILembreteRepository, LembreteRepository>()
            .AddScoped<ILembreteService, LembreteService>()
            .AddSingleton<IRelatorioLembreteService, RelatorioLembreteService>();
    }
}
