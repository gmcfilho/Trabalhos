export function obterElemento(id) {
    const elemento = document.getElementById(id);
    if (!elemento) throw new Error(`Elemento #${id} não encontrado no HTML.`);
    return elemento;
}

export function escaparHtml(texto) {
    const auxiliar = document.createElement("div");
    auxiliar.textContent = texto ?? "";
    return auxiliar.innerHTML;
}
