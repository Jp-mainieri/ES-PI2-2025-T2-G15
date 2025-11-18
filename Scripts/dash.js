//Feito por Giovana Uchelli - 25008818

// verifica se existe um usuário logado na sessão
const usuarioLogado = sessionStorage.getItem("usuarioLogado");

// se não tiver, redireciona para o login
if (!usuarioLogado) {
    window.location.href = "login.html";
}
