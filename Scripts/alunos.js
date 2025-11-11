let turmasData = [];
let alunosData = [];

const API_URL = "http://localhost:3000";

async function adicionarAluno(ra_aluno, nome, id_turma){
    try{
        const response = await fetch (`${API_URL}/alunos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ra_aluno,
                nome,
                id_turma
            }),
        });

        if (!response.ok) throw new Error("Erro ao adicionar aluno");

        alert("Aluno adicionado com sucesso!");

    }catch (error) {
        console.error("Erro:", error);
        alert("Erro ao adicionar aluno: " + error.message);
    }
}

async function carregarTurmas() {
    try {
        const response = await fetch(`${API_URL}/turmas`)
        if (!response.ok) throw new Error("Erro ao carregar turmas");

        turmasData = await response.json();
        renderizarOpcoesTurmas();
    } catch (error) {
        console.error("Erro:", error);
    }
}

async function carregarAlunos() {
    try {
        const response = await fetch(
            `${API_URL}/alunos`
        );
        if (!response.ok) throw new Error("Erro ao carregar alunos");

        alunosData = await response.json();
        renderizarAlunos();
    } catch (error) {
        console.error("Erro:", error);
    }
}

function renderizarAlunos() {
    const tabela = document.getElementById("tabela-alunos");
    if (!tabela) return;

    const linhasExistentes = tabela.querySelectorAll("tr:not(:first-child)");
    linhasExistentes.forEach((linha) => linha.remove());

    alunosData.forEach((aluno) => {
        const nova_linha = document.createElement("tr");
        nova_linha.innerHTML = `
      <td>${aluno.NOME || "N/A"}</td>
      <td>${aluno.RA_ALUNO}</td>
      <td>${aluno.ID_TURMA}</td>
      <td class="acoes">
            <button class="btn-acao" data-id="${
            aluno.RA_ALUNO
        }"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-acao" data-id="${
            aluno.RA_ALUNO
        }"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
        tabela.appendChild(nova_linha);
    });
}

function renderizarOpcoesTurmas() {
    const sessao = document.getElementById("turmaAluno");
    if (!sessao) return;

    const opcoesExistentes = sessao.querySelectorAll("option:not(:first-child)");
    opcoesExistentes.forEach((linha) => linha.remove());

    turmasData.forEach((turma) => {
        const nova_opcao = document.createElement('option');
        nova_opcao.value = turma.id;
        nova_opcao.textContent = turma.NOME;
        sessao.appendChild(nova_opcao);
    });
}

carregarAlunos();

// === Abrir o modal quando clicar no botão "Cadastrar Aluno" ===
const btnCadastrar = document.getElementById("btnCadastrar");
btnCadastrar.addEventListener("click", function (e) {
  e.preventDefault();
  abrirModal("modalCadastrar");
  carregarTurmas();
});

// === Funções para abrir e fechar o modal ===
function abrirModal(id) {
  document.getElementById(id).style.display = "flex";
}

function fecharModal(id) {
  document.getElementById(id).style.display = "none";
}

// === Fechar o modal ao clicar fora dele ===
window.addEventListener("click", function (event) {
  const modal = document.getElementById("modalCadastrar");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// === Envio do formulário de adicionar aluno ===
document
  .getElementById("formCadastrarAluno")
  .addEventListener("submit", async (e)=> {
    e.preventDefault();
    const ra = e.target.querySelector('input[name="raAluno"]').value;
    const nome = e.target.querySelector('input[name="nomeAluno"]').value;
    const turma = e.target.querySelector('select[name="turmaAluno"]')?.value;
    await adicionarAluno(ra, nome, turma);
    alert("Aluno cadastrado com sucesso!");
    fecharModal("modalCadastrar");
    e.target.reset();
    carregarAlunos()
  });

// === Abrir o modal "Importar Alunos" ===
const btnImportar = document.getElementById("btnImportar");
btnImportar.addEventListener("click", function (e) {
  e.preventDefault();
  abrirModal("modalImportar");
});

// === Envio do formulário de importação ===
document
  .getElementById("formImportarAlunos")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const turma = document.getElementById("turmaImportar").value;
    const formato = document.querySelector('input[name="formato"]:checked').value;
    const arquivo = document.getElementById("arquivoAlunos").files[0];

    if (!turma) {
      alert("Selecione uma turma antes de importar.");
      return;
    }

    if (!arquivo) {
      alert("Selecione um arquivo para importar.");
      return;
    }

    alert(`Arquivo "${arquivo.name}" (${formato.toUpperCase()}) importado com sucesso para a turma ${turma}!`);

    fecharModal("modalImportar");
    e.target.reset();
  });


  // === Função para abrir o modal de edição ===
document.querySelectorAll(".btn-acao .fa-pen").forEach((btn) => {
  btn.addEventListener("click", function () {
    const linha = this.closest("tr");
    const nome = linha.children[0].innerText;
    const matricula = linha.children[1].innerText;
    const instituicao = linha.children[2].innerText;
    const turma = linha.children[3].innerText;
    const situacao = linha.children[4].innerText;

    // Preenche os campos do modal
    document.getElementById("editarNomeAluno").value = nome;
    document.getElementById("editarMatriculaAluno").value = matricula;
    document.getElementById("editarInstituicaoAluno").value = instituicao;
    document.getElementById("editarTurmaAluno").value = turma;
    document.getElementById("editarSituacaoAluno").value = situacao;

    abrirModal("modalEditar");
  });
});

// === Enviar formulário de edição ===
document.getElementById("formEditarAluno").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Dados do aluno atualizados com sucesso!");
  fecharModal("modalEditar");
});

// === Função para abrir modal de exclusão ===
let linhaParaExcluir = null;

document.querySelectorAll(".btn-acao .fa-trash").forEach((btn) => {
  btn.addEventListener("click", function () {
    linhaParaExcluir = this.closest("tr");
    abrirModal("modalExcluir");
  });
});

// === Confirmar exclusão ===
document.getElementById("confirmarExcluir").addEventListener("click", function () {
  if (linhaParaExcluir) {
    linhaParaExcluir.remove();
    linhaParaExcluir = null;
    alert("Aluno excluído com sucesso!");
  }
  fecharModal("modalExcluir");
});

