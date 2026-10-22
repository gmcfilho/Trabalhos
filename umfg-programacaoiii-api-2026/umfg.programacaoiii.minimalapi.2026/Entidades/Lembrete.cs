namespace umfg.programacaoiii.minimalapi._2026.Entidades;

public sealed class Lembrete
{
    public const int TamanhoMaximoDescricao = 500;

    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Descricao { get; private set; }
    public DateTime DataCadastro { get; private set; } = DateTime.Now;
    public DateTime DataAtualizacao { get; private set; } = DateTime.Now;
    public bool IsAtivo { get; private set; } = true;

    public Lembrete(string descricao)
    {
        Descricao = ValidarDescricao(descricao);
    }

    public void AtualizarDescricao(string descricao)
    {
        Descricao = ValidarDescricao(descricao);
        RegistrarAtualizacao();
    }

    public void Inativar()
    {
        IsAtivo = false;
        RegistrarAtualizacao();
    }

    private void RegistrarAtualizacao() => DataAtualizacao = DateTime.Now;

    private static string ValidarDescricao(string descricao)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(descricao);
        return descricao.Trim();
    }
}
