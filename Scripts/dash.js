//Feito por Giovana Uchelli - 25008818
const usuarioLogado = sessionStorage.getItem("usuarioLogado");
if (!usuarioLogado) {
    window.location.href = "login.html";
}
