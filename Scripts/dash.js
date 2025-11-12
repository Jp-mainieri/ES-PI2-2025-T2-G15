// Proteção de página
const usuarioLogado = sessionStorage.getItem("usuarioLogado");
if (!usuarioLogado) {
    window.location.href = "login.html";
}
