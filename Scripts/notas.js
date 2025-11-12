const API_URL = "http://localhost:3000";

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const idProfessor = usuarioLogado.id_professor;
let idInstituicaoAtiva;
let idCursoAtivo;
let idDisciplinaAtiva;
let idTurmaAtiva;

let instituicoesData = [];
let cursosData = [];
let disciplinasData = [];
let turmasData = [];

async function carregarInstituicoes() {
    try {
        const response = await fetch(`${API_URL}/instituicoes/professor/${idProfessor}`);
        if (!response.ok) throw new Error("Erro ao carregar instituições");

        instituicoesData = await response.json();
        renderizarOpcoesInstituicoes();
    } catch (error) {
        console.error("Erro:", error);
        alert(
            "Erro ao carregar instituições. Verifique se o servidor está rodando."
        );
    }
}

function renderizarOpcoesInstituicoes() {
    const selects = document.querySelectorAll(".sortInstituicao");
    if (!selects) return;

    selects.forEach(sessao => {
        const opcoesExistentes = sessao.querySelectorAll("option:not(:first-child)");
        opcoesExistentes.forEach((opcao) => opcao.remove());

        instituicoesData.forEach((inst) => {
            const nova_opcao = document.createElement('option');
            nova_opcao.value = inst.id;
            nova_opcao.textContent = inst.NOME;
            sessao.appendChild(nova_opcao);
        });
    })

}

async function carregarCursos() {
    try {
        const response = await fetch(`${API_URL}/cursos/instituicao/${idInstituicaoAtiva}`)
        if (!response.ok) throw new Error("Erro ao carregar turmas");

        cursosData = await response.json();
        renderizarOpcoesCursos();
    } catch (error) {
        console.error("Erro:", error);
    }
}

function renderizarOpcoesCursos() {
    const selects = document.querySelectorAll(".sortCurso");
    if (!selects) return;

    selects.forEach(sessao => {
        const opcoesExistentes = sessao.querySelectorAll("option:not(:first-child)");
        opcoesExistentes.forEach((opcao) => opcao.remove());

        cursosData.forEach((curso) => {
            const nova_opcao = document.createElement('option');
            nova_opcao.value = curso.id;
            nova_opcao.textContent = curso.NOME;
            sessao.appendChild(nova_opcao);
        });
    })

}

async function carregarDisciplinas() {
    try {
        const response = await fetch(`${API_URL}/disciplinas/curso/${idCursoAtivo}`)
        if (!response.ok) throw new Error("Erro ao carregar turmas");

        disciplinasData = await response.json();
        renderizarOpcoesDisciplinas();
    } catch (error) {
        console.error("Erro:", error);
    }
}

function renderizarOpcoesDisciplinas() {
    const selects = document.querySelectorAll(".sortDisciplina");
    if (!selects) return;

    selects.forEach(sessao => {
        const opcoesExistentes = sessao.querySelectorAll("option:not(:first-child)");
        opcoesExistentes.forEach((opcao) => opcao.remove());

        disciplinasData.forEach((disc) => {
            const nova_opcao = document.createElement('option');
            nova_opcao.value = disc.id;
            nova_opcao.textContent = disc.NOME;
            sessao.appendChild(nova_opcao);
        });
    })

}

async function carregarTurmas() {
    try {
        const response = await fetch(`${API_URL}/turmas/instituicao/${idInstituicaoAtiva}`)
        if (!response.ok) throw new Error("Erro ao carregar turmas");

        turmasData = await response.json();
        renderizarOpcoesTurmas();
    } catch (error) {
        console.error("Erro:", error);
    }
}

function renderizarOpcoesTurmas() {
    const selects = document.querySelectorAll(".sortTurma");
    if (!selects) return;

    selects.forEach(sessao => {
        const opcoesExistentes = sessao.querySelectorAll("option:not(:first-child)");
        opcoesExistentes.forEach((opcao) => opcao.remove());

        turmasData.forEach((turma) => {
            const nova_opcao = document.createElement('option');
            nova_opcao.value = turma.id;
            nova_opcao.textContent = turma.NOME;
            sessao.appendChild(nova_opcao);
        });
    })

}

carregarInstituicoes();

const selectsInstituicao = document.getElementsByClassName("sortInstituicao");
for (const select of selectsInstituicao) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idInstituicaoAtiva = e.target.value;
        await carregarCursos();
    });
}
const selectsCurso = document.getElementsByClassName("sortCurso");
for (const select of selectsCurso) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idCursoAtivo = e.target.value;
        await carregarDisciplinas();
    });
}
const selectsDisciplina = document.getElementsByClassName("sortDisciplina");
for (const select of selectsDisciplina) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idDisciplinaAtiva = e.target.value;
        await carregarTurmas();
    });
}
const selectsTurma = document.getElementsByClassName("sortTurma");
for (const select of selectsTurma) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idTurmaAtiva = e.target.value;
    });
}
// === Abrir modal ===
document.querySelector('.btn-exportar').addEventListener('click', function() {
  abrirModal('modalExportar');
});

function abrirModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function fecharModal(id) {
  document.getElementById(id).style.display = 'none';
}

// === Envio do formulário ===
document.getElementById('formExportarNotas').addEventListener('submit', function(e) {
  e.preventDefault();

  const instituicao = document.getElementById('instituicaoExportar').value;
  const curso = document.getElementById('cursoExportar').value;
  const turma = document.getElementById('turmaExportar').value;
  const formato = document.querySelector('input[name="formato"]:checked').value;

  if (!instituicao || !curso || !turma) {
    alert('Por favor, preencha todos os campos antes de exportar.');
    return;
  }

  alert(`Exportando notas da turma ${turma} (${formato.toUpperCase()})...`);
  fecharModal('modalExportar');
  this.reset();
});
