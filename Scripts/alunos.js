// === Abrir o modal quando clicar no botão "Cadastrar Aluno" ===
const btnCadastrar = document.getElementById("btnCadastrar");
btnCadastrar.addEventListener("click", function (e) {
  e.preventDefault();
  abrirModal("modalCadastrar");
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

// === Envio do formulário (apenas demonstração) ===
document
  .getElementById("formCadastrarAluno")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Aluno cadastrado com sucesso!");
    fecharModal("modalCadastrar");
    this.reset();
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
    this.reset();
  });
