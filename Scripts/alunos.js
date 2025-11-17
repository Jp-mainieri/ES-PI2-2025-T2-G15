// Feito por João Pedro Panza Mainieri - 25006642

// Dados
let turmasData = [];
let alunosData = [];
let instituicoesData = [];
let idInstituicaoAtiva = -1;

// Usário logado
const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const idProfessor = usuarioLogado.id_professor;

// Base da API
const API_URL = "http://localhost:3000";

// Adcionar Aluno no banco de dados
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

// Editar Aluno no banco de dados
async function editarAluno(ra, nome) {
    try {
        const response = await fetch(`${API_URL}/alunos/${ra}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                nome,
            }),
        });

        if (!response.ok) throw new Error("Erro ao atualizar aluno");

        alert("Dados do aluno atualizados com sucesso!");
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao atualizar aluno: " + error.message);
    }
}

// Deletar Aluno no banco de dados
async function deleteAluno(ra){
    try{
        const response = await fetch(`${API_URL}/alunos/${ra}`, {
            method: "delete",
        });
        if (!response.ok) throw new Error("Erro ao atualizar aluno");

        alert("Aluno excluido com sucesso!");
    }catch (err) {
        console.error("Erro:", error);
        alert("Erro ao excluir aluno: " + error.message);
    }
}

// Carregar as intituições a partir do professor do banco de dados
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

// Carregar turmas a partir da instituição do banco de dados
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

// Carregar Alunos a partir da instituição do banco de dados
async function carregarAlunos() {
  try {
    const response = await fetch(
      `${API_URL}/alunos/instituicao/${idInstituicaoAtiva}`
    );
    if (!response.ok) throw new Error("Erro ao carregar alunos");
    alunosData = await response.json();
  } catch (error) {
    console.error("Erro:", error);
  }
  
  await carregarTurmas();
  await renderizarAlunos();
}

// Renderizar a tabela alunos no elemento: tabela-alunos
function renderizarAlunos() {
    const tabela = document.getElementById("tabela-alunos");
    if (!tabela) return;

    const linhasExistentes = tabela.querySelectorAll("tr:not(:first-child)");
    linhasExistentes.forEach((linha) => linha.remove());

    // Para cada aluno:
    alunosData.forEach((aluno) => {
        const nova_linha = document.createElement("tr");
        const turma = turmasData.find(t => t.id == aluno.ID_TURMA);
        nova_linha.innerHTML = `
        <td>${aluno.NOME || "N/A"}</td>
        <td>${aluno.RA_ALUNO}</td>
        <td>${turma.NOME}</td>
        <td class="acoes">
        <button class="btn-acao btn-editar" data-id="${
        aluno.RA_ALUNO}"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-acao btn-excluir" data-id="${
        aluno.RA_ALUNO}"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
        tabela.appendChild(nova_linha);
    });
}

// Renderiza o filtro de turmas
function renderizarOpcoesTurmas() {
    const selects = document.querySelectorAll(".opcoesTurmas");
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

// Renderiza o filtro de instituições
function renderizarOpcoesInstituicoes() {
    const selects = document.querySelectorAll(".select-instituicao");
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

// Abrir o modal quando clicar no botão "Cadastrar Aluno"
const btnCadastrar = document.getElementById("btnCadastrar");
btnCadastrar.addEventListener("click", async(e) => {
  await carregarTurmas();
  e.preventDefault();
  abrirModal("modalCadastrar");
});

// Funções para abrir e fechar o modal
function abrirModal(id) {
  document.getElementById(id).style.display = "flex";
}

function fecharModal(id) {
  document.getElementById(id).style.display = "none";
}

// Fechar o modal ao clicar fora dele
window.addEventListener("click", function (event) {
  const modal = document.getElementById("modalCadastrar");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// Se mudar no select de instituição: 
document.getElementById("sortInstituicao").addEventListener("change", async(e) => {
    e.preventDefault();
    const select = document.getElementById("sortInstituicao");
    idInstituicaoAtiva = select.value;
    await carregarAlunos();
})

// Envio do formulário de adicionar aluno
document
  .getElementById("formCadastrarAluno")
  .addEventListener("submit", async (e)=> {
    e.preventDefault();
    const ra = e.target.querySelector('input[name="raAluno"]').value;
    const nome = e.target.querySelector('input[name="nomeAluno"]').value;
    const turma = e.target.querySelector('select[name="turmaAluno"]')?.value;
    await adicionarAluno(ra, nome, turma);
    fecharModal("modalCadastrar");
    e.target.reset();
    carregarAlunos()
  });

// Abrir o modal "Importar Alunos"
const btnImportar = document.getElementById("btnImportar");
btnImportar.addEventListener("click", function (e) {
  e.preventDefault();
  abrirModal("modalImportar");
});

// Envio do formulário de importação
document.getElementById("btn-confirmarImportacao").addEventListener("click", function (e) {
    e.preventDefault();

    const turma = document.getElementById("turmaImportar").value;
    const arquivo = document.getElementById("arquivoAlunos").files[0];

    if (!turma) {
      alert("Selecione uma turma antes de importar.");
      return;
    }

    if (!arquivo) {
      alert("Selecione um arquivo para importar.");
      return;
    }

    // Leitura do Arquivo CSV
    const reader = new FileReader();
    reader.onload = async (e) => {
        const conteudo = e.target.result;
        const linhas = conteudo.trim().split(/\r?\n/);
        const dados = linhas.slice(1).filter(l => l.trim() !== "");

        const alunos = dados.map(linha => {
          const partes = linha.split(',');
          const nome = partes[0]?.trim();
          const ra = partes[1]?.trim();
          return { nome, ra_aluno: ra, id_turma: turma };
        });
    
        // Enviar pela rota
        let tudoCerto = true;
        try {
          for (const aluno of alunos) {
            response = await fetch(`${API_URL}/alunos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(aluno)
            })
            if (!response.ok) {
                console.log(`Erro ao importar ${aluno.nome}: RA já existe no sistema`);
                tudoCerto = false
            }
          }
          if (!tudoCerto) {
              alert(`Foi(Foram) inserido/s algum(alguns) aluno/s com o RA repetido no processo de importação, verifique no console`)
          }
          fecharModal("modalImportar");
          document.getElementById("formImportarAlunos").reset();
          carregarAlunos();
        } catch (error) {
          console.error("Erro ao importar alunos:", error);
          alert("Ocorreu um erro ao importar os alunos. Por favor, tente novamente.");
        }
    }
    reader.readAsText(arquivo, "UTF-8");
});

// Quando clicar no botão editar na tabela dos alunos: 
document.getElementById("tabela-alunos").addEventListener("click", async (event) => {
  // Função para abrir o modal de edição
  if (event.target.closest(".btn-editar")) {
    const btn = event.target.closest(".btn-editar");
    const ra = btn.getAttribute("data-id");

    const aluno = alunosData.find(a => a.RA_ALUNO == ra);
    if (!aluno) return;

    // Preenche os campos do modal
    document.getElementById("editarNomeAluno").value = aluno.NOME;
    document.getElementById("editarRaAluno").textContent = aluno.RA_ALUNO;

    // Descobre a turma
    const turmaDoAluno = turmasData.find(t => t.id == aluno.ID_TURMA);
    document.getElementById("editarTurmaAluno").textContent = turmaDoAluno?.NOME || "N/A";

    abrirModal("modalEditar");
}


  // Função para abrir modal de exclusão
  if (event.target.closest(".btn-excluir")) {
    const btn = event.target.closest(".btn-excluir");
    const ra = btn.getAttribute("data-id");

    const aluno = alunosData.find(a => a.RA_ALUNO == ra);

    if (!aluno) return;

    document.getElementById("confirmarExcluir").setAttribute("data-ra", ra);
    abrirModal("modalExcluir");
  }
});

// Enviar formulário de edição de aluno
document.getElementById("formEditarAluno").addEventListener("submit", async (e) => {
  e.preventDefault();

  const ra = document.getElementById("editarRaAluno").textContent;
  const nome = document.getElementById("editarNomeAluno").value;

  const turma = document.getElementById("editarTurmaAluno").textContent;

    await editarAluno(ra, nome)
    fecharModal("modalEditar");
    carregarAlunos();
});

// Confirmar exclusão
document.getElementById("confirmarExcluir").addEventListener("click", async (e) => {
    const ra = e.target.getAttribute("data-ra");
    
    if (!ra) return;

    await deleteAluno(ra);
    fecharModal("modalExcluir");
    carregarAlunos();
});

// Inicialização
carregarInstituicoes();