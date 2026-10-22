export function formatarDataHora(valorIso) {
    if (!valorIso) return "—";

    const data = new Date(valorIso);
    if (Number.isNaN(data.getTime())) return "—";

    return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function resumir(texto, limite) {
    return texto.length > limite ? `${texto.slice(0, limite)}…` : texto;
}
