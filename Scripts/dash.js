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

const cardQtdAlunos = document.getElementById("qtdAlunos");
const cardQtdInstituicoes = document.getElementById("qtdInstituicoes");
const cardQtdNotas = document.getElementById("qtdNotas");
//const cardMediaGeral = document.getElementById("mediaGeral");

async function carregarContagemNotas() {
    try {
        const response = await fetch(`${API_URL}/notas/professor/${idProfessor}`);
        if (!response.ok) throw new Error("Erro ao contar notas");

        const countNotas = await response.json();
        console.log(response)
        console.log(countNotas)
        cardQtdNotas.innerText = countNotas.TOTAL_NOTAS
    } catch (error) {
        console.error("Erro:", error);
        alert(
            "Erro ao contar Notas. Verifique se o servidor está rodando."
        );
    }
}
async function carregarContagemAlunos() {
    try {
        const response = await fetch(`${API_URL}/alunos/professor/${idProfessor}`);
        if (!response.ok) throw new Error("Erro ao contar alunos");

        const countAlunos = await response.json()
        console.log(response)
        cardQtdAlunos.innerText = countAlunos.TOTAL_ALUNOS
    } catch (error) {
        console.error("Erro:", error);
        alert(
            "Erro ao contar Alunos. Verifique se o servidor está rodando."
        );
    }
}
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

const cardAuditoria = document.getElementById("updates-list")

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

async function carregarDashboard() {
    await carregarContagemInstituicoes();
    await carregarContagemAlunos();
    await carregarContagemNotas();
    await carregarAuditoria()
}

carregarDashboard();