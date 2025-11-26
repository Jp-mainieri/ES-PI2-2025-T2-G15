//Feito por Giovana Uchelli - 25008818
//E Feito por João Pedro Panza Mainieri - 25006642

// Base da API
const API_URL = "http://localhost:3000";

// verifica se existe um usuário logado na sessão
const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const idProfessor = usuarioLogado.id_professor;

// se não tiver, redireciona para o login
if (usuarioLogado.id_professor === undefined) {
    window.location.href = "login.html";
}

//Cards para colocar as contagens
const cardQtdAlunos = document.getElementById("qtdAlunos");
const cardQtdInstituicoes = document.getElementById("qtdInstituicoes");
const cardQtdNotas = document.getElementById("qtdNotas");
//const cardMediaGeral = document.getElementById("mediaGeral");

//Carrega a contagem de quantas notas tem no banco de dados relacionadas com o professor logado
async function carregarContagemNotas() {
    try {
        const response = await fetch(`${API_URL}/notas/professor/${idProfessor}`);
        if (!response.ok) throw new Error("Erro ao contar notas");

        const countNotas = await response.json();
        cardQtdNotas.innerText = countNotas.TOTAL_NOTAS
    } catch (error) {
        console.error("Erro:", error);
        alert(
            "Erro ao contar Notas. Verifique se o servidor está rodando."
        );
    }
}
//Carrega a contagem de quantos alunos tem no banco de dados relacionados com o professor logado
async function carregarContagemAlunos() {
    try {
        const response = await fetch(`${API_URL}/alunos/professor/${idProfessor}`);
        if (!response.ok) throw new Error("Erro ao contar alunos");

        const countAlunos = await response.json()
        cardQtdAlunos.innerText = countAlunos.TOTAL_ALUNOS
    } catch (error) {
        console.error("Erro:", error);
        alert(
            "Erro ao contar Alunos. Verifique se o servidor está rodando."
        );
    }
}


//Carrega as instituições do professor logado e conta quantas são
async function carregarContagemInstituicoes() {
    try {
        const response = await fetch(`${API_URL}/instituicoes/professor/${idProfessor}`);
        if (!response.ok) throw new Error("Erro ao carregar instituicoes");

        const instituicoesData = await response.json();
        cardQtdInstituicoes.innerText = instituicoesData.length
    } catch (error) {
        console.error("Erro:", error);
        alert(
            "Erro ao carregar instituições. Verifique se o servidor está rodando."
        );
    }
}

//Card para colocar os logs da auditoria
const cardAuditoria = document.getElementById("updates-list")

//Carrega e renderiza as entradas na tabela auditoria do professor logado
async function carregarAuditoria() {
    try {
        const response = await fetch(`${API_URL}/auditoria/professor/${idProfessor}`);
        if (!response.ok) throw new Error("Erro ao carregar auditoria");

        const auditoriaData = await response.json();
        const linhasExistentes = cardAuditoria.querySelectorAll("li");
        linhasExistentes.forEach((linha) => linha.remove());
        if (auditoriaData.length !== 0) {
        auditoriaData.forEach((aud) => {
            const nova_linha = document.createElement("li");
            nova_linha.innerHTML = `
            <i class="fas fa-circle update-dot"></i> ${aud.descricao} - ${aud.data_hora}
            `
            cardAuditoria.appendChild(nova_linha);
        })
        }else {
            const nova_linha = document.createElement("li");
            nova_linha.innerHTML = `
            <i class="fas fa-circle update-dot"></i> Você ainda não inseriu uma nota!
            `
            cardAuditoria.appendChild(nova_linha);
        }
    } catch (error) {
        console.error("Erro:", error);
        alert(
            "Erro ao carregar instituições. Verifique se o servidor está rodando."
        );
    }
}

// Inicializar
async function carregarDashboard() {
    await carregarContagemInstituicoes();
    await carregarContagemAlunos();
    await carregarContagemNotas();
    await carregarAuditoria()
}

carregarDashboard();