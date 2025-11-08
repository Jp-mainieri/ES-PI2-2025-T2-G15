const API_URL = "http://localhost:3000";

let instituicoesData = [];
let cursosData = [];
let disciplinasData = [];
let turmasData = [];

//Serve para guardar o id do que está em exibição
let idIinstituicaoAtiva;
let idCursoAtivo;
let idDisciplinaAtiva;

// Funções para o FETCH

async function carregarInstituicoes() {
  try {
    const response = await fetch(`${API_URL}/instituicoes`);
    if (!response.ok) throw new Error("Erro ao carregar instituições");

    instituicoesData = await response.json();
    renderizarInstituicoes();
  } catch (error) {
    console.error("Erro:", error);
    alert(
      "Erro ao carregar instituições. Verifique se o servidor está rodando."
    );
  }
}

function renderizarInstituicoes() {
  const tabela = document.getElementById("tabela-instituicoes");
  if (!tabela) return; // evita erro se o elemento não existir

  const linhasExistentes = tabela.querySelectorAll("tr:not(:first-child)");
  linhasExistentes.forEach((linha) => linha.remove());

  instituicoesData.forEach((inst) => {
    const nova_linha = document.createElement("tr");
    nova_linha.innerHTML = `
      <td>${inst.nome}</td>
      <td>
        <div class="tabela-acoes">
          <div class="tabela-botoes">
            <button class="btn-ver-cursos" data-id="${inst.id}">Ver cursos</button>
            <button class="btn-editar-instituicao" data-id="${inst.id}"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-excluir-instituicao" data-id="${inst.id}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </td>
    `;
    tabela.appendChild(nova_linha);
  });
}

async function carregarCursos(id_instituicao) {
  try {
    const response = await fetch(
      `${API_URL}/cursos/instituicao/${id_instituicao}`
    );
    if (!response.ok) throw new Error("Erro ao carregar cursos");

    cursosData = await response.json();
    renderizarCursos();
  } catch (error) {
    console.error("Erro:", error);
  }
}

function renderizarCursos() {
  const tabela = document.getElementById("tabela-cursos");
  if (!tabela) return;

  const linhasExistentes = tabela.querySelectorAll("tr:not(:first-child)");
  linhasExistentes.forEach((linha) => linha.remove());

  cursosData.forEach((curso) => {
    const nova_linha = document.createElement("tr");
    nova_linha.innerHTML = `
      <td>${curso.nome || curso.NOME || "N/A"}</td>
      <td>${curso.codigo || curso.CODIGO || "N/A"}</td>
      <td>
        <div class="tabela-acoes">
          <div class="tabela-botoes">
            <button class="btn-ver-disciplinas" data-id="${
              curso.id
            }">Ver disciplinas</button>
            <button class="btn-editar-curso" data-id="${
              curso.id
            }"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-excluir-curso" data-id="${
              curso.id
            }"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </td>
    `;
    tabela.appendChild(nova_linha);
  });
}

async function carregarDisciplinas(id_curso) {
  try {
    const response = await fetch(`${API_URL}/disciplinas/curso/${id_curso}`);
    if (!response.ok) throw new Error("Erro ao carregar disciplinas");

    disciplinasData = await response.json();
    renderizarDisciplinas();
  } catch (error) {
    console.error("Erro:", error);
  }
}

function renderizarDisciplinas() {
  const tabela = document.getElementById("tabela-disciplinas");

  const linhasExistentes = tabela.querySelectorAll("tr:not(:first-child)");
  linhasExistentes.forEach((linha) => linha.remove());

  disciplinasData.forEach((disc) => {
    const nova_linha = document.createElement("tr");
    let periodoDisciplina;
    switch (disc.PERIODO) {
      case 1:
        periodoDisciplina = "MATUTINO";
        break;
      case 2:
        periodoDisciplina = "VESPERTINO";
        break;
      case 3:
        periodoDisciplina = "NOTURNO";
        break;
      case 4:
        periodoDisciplina = "INTEGRAL";
        break;
      default:
        periodoDisciplina = "INVÁLIDO";
    }
    nova_linha.innerHTML = `
      <td>${disc.NOME || "N/A"}</td>
      <td>${disc.SIGLA}</td>
      <td>${disc.CODIGO}</td>
      <td>${periodoDisciplina}</td>
      <td>
        <div class="tabela-acoes">
          <div class="tabela-botoes">
            <button class="btn-ver-turmas" data-id="${
              disc.ID_DISCIPLINA
            }">Ver turmas</button>
            <button class="btn-editar-disciplina" data-id="${
              disc.ID_DISCIPLINA
            }"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-excluir-disciplina" data-id="${
              disc.ID_DISCIPLINA
            }"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </td>
    `;
    tabela.appendChild(nova_linha);
  });
}

async function carregarTurmas() {
  try {
    const response = await fetch(`${API_URL}/turmas`);
    if (!response.ok) throw new Error("Erro ao carregar turmas");

    turmasData = await response.json();
    renderizarTurmas();
  } catch (error) {
    console.error("Erro:", error);
  }
}

function renderizarTurmas() {
  const tabela = document.getElementById("tabela-turmas");

  const linhasExistentes = tabela.querySelectorAll("tr:not(:first-child)");
  linhasExistentes.forEach((linha) => linha.remove());

  turmasData.forEach((turma) => {
    const nova_linha = document.createElement("tr");
    nova_linha.innerHTML = `
      <td>${turma.sigla}</td>
      <td>
        <div class="tabela-acoes">
          <div class="tabela-botoes">
            <button class="btn-editar-turma" data-id="${turma.id_turma}"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-excluir-turma" data-id="${turma.id_turma}"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </td>
    `;
    tabela.appendChild(nova_linha);
  });
}

async function adicionarInstituicao(nome) {
  try {
    const response = await fetch(`${API_URL}/instituicoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, id_professor: 0 }),
    });

    if (!response.ok) throw new Error("Erro ao adicionar instituição");

    alert("Instituição adicionada com sucesso!");
    await carregarInstituicoes();
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao adicionar instituição: " + error.message);
  }
}

async function adicionarCurso(nome, codigo) {
  try {
    const response = await fetch(`${API_URL}/cursos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        nome,
        codigo,
        id_instituicao: idIinstituicaoAtiva,
      }),
    });

    if (!response.ok) throw new Error("Erro ao adicionar curso");

    alert("Curso adicionado com sucesso!");
    // recarrega cursos usando a instituição ativa
    await carregarCursos(idIinstituicaoAtiva);
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao adicionar curso: " + error.message);
  }
}

async function adicionarDisciplina(nome, sigla, codigo, periodo) {
  try {
    let periodoNumber;
    switch (periodo) {
      case "MATUTINO":
        periodoNumber = 1;
        break;
      case "VESPERTINO":
        periodoNumber = 2;
        break;
      case "NOTURNO":
        periodoNumber = 3;
        break;
      case "INTEGRAL":
        periodoNumber = 4;
        break;
      default:
        periodoNumber = 5;
    }
    const response = await fetch(`${API_URL}/disciplinas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        sigla,
        codigo,
        periodo: periodoNumber,
        id_curso: idCursoAtivo,
      }),
    });

    if (!response.ok) throw new Error("Erro ao adicionar disciplina");

    alert("Disciplina adicionada com sucesso!");
    await carregarDisciplinas();
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao adicionar disciplina: " + error.message);
  }
}

async function adicionarTurma(sigla, id_disciplina) {
  try {
    const response = await fetch(`${API_URL}/turmas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sigla, id_disciplina: parseInt(id_disciplina) }),
    });

    if (!response.ok) throw new Error("Erro ao adicionar turma");

    alert("Turma adicionada com sucesso!");
    await carregarTurmas();
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao adicionar turma: " + error.message);
  }
}

async function deletarInstituicao(id) {
  if (!confirm("Tem certeza que deseja deletar esta instituição?")) return;

  try {
    const response = await fetch(`${API_URL}/instituicoes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao deletar instituição");

    alert("Instituição deletada com sucesso!");
    await carregarInstituicoes();
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao deletar instituição: " + error.message);
  }
}

async function deletarCurso(id) {
  if (!confirm("Tem certeza que deseja deletar este curso?")) return;

  try {
    const response = await fetch(`${API_URL}/cursos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao deletar curso");

    alert("Curso deletado com sucesso!");
    await carregarCursos();
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao deletar curso: " + error.message);
  }
}

async function deletarDisciplina(id) {
  if (!confirm("Tem certeza que deseja deletar esta disciplina?")) return;

  try {
    const response = await fetch(`${API_URL}/disciplinas/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao deletar disciplina");

    alert("Disciplina deletada com sucesso!");
    await carregarDisciplinas();
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao deletar disciplina: " + error.message);
  }
}

async function deletarTurma(id) {
  if (!confirm("Tem certeza que deseja deletar esta turma?")) return;

  try {
    const response = await fetch(`${API_URL}/turmas/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao deletar turma");

    alert("Turma deletada com sucesso!");
    await carregarTurmas();
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao deletar turma: " + error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  /* ======== MODAL ======== */

  // Funções do Fetch para carregar as tabelas
  carregarInstituicoes();
  carregarTurmas();

  const popup = document.getElementById("popup-novo-elemento");
  const titulo = document.getElementById("novo-elemento-title");
  const forms = {
    instituicao: document.getElementById("nova-instituicao-form"),
    curso: document.getElementById("novo-curso-form"),
    disciplina: document.getElementById("nova-disciplina-form"),
    turma: document.getElementById("nova-turma-form"),
  };

  function abrirPopup(tipo) {
    popup.style.display = "flex";
    titulo.textContent =
      tipo === "instituicao"
        ? "Nova Instituição"
        : tipo === "curso"
        ? "Novo Curso"
        : tipo === "disciplina"
        ? "Nova Disciplina"
        : "Nova Turma";
    Object.values(forms).forEach((f) => f.classList.remove("active"));
    forms[tipo].classList.add("active");
  }

  function fecharPopup() {
    popup.style.display = "none";
    Object.values(forms).forEach((f) => f.classList.remove("active"));
  }

  document.addEventListener("click", (e) => {
    if (e.target.matches(".btn-nova-instituicao")) abrirPopup("instituicao");
    else if (e.target.matches("#btn-novo-curso")) abrirPopup("curso");
    else if (e.target.matches("#btn-nova-disciplina")) abrirPopup("disciplina");
    else if (e.target.matches(".btn-nova-turma")) abrirPopup("turma");
    else if (e.target.matches(".btn-cancelar")) fecharPopup();
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) fecharPopup();
  });

  document;
  forms.instituicao?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = e.target.querySelector('input[name="nome"]').value;
    await adicionarInstituicao(nome);
    fecharPopup();
    e.target.reset();
  });

  forms.curso?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = e.target.querySelector('input[name="nome"]').value;
    const codigo = e.target.querySelector('input[name="codigo"]').value;
    await adicionarCurso(nome, codigo);
    fecharPopup();
    e.target.reset();
  });

  forms.disciplina?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = e.target.querySelector('input[name="nome"]').value;
    const sigla = e.target.querySelector('input[name="sigla"]').value;
    const codigo = e.target.querySelector('input[name="codigo"]').value;
    const periodo = e.target.querySelector('input[name="periodo"]').value;
    await adicionarDisciplina(nome, sigla, codigo, periodo);
    fecharPopup();
    e.target.reset();
  });

  forms.turma?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const sigla = e.target.querySelector('input[name="sigla"]').value;
    const id_disciplina = e.target.querySelector(
      'select[name="disciplina"]'
    ).value;
    await adicionarTurma(sigla, id_disciplina);
    fecharPopup();
    e.target.reset();
  });

  /* ======== MOSTRAR / OCULTAR SEÇÕES ======== */
  const secCursos = document.getElementById("sec-cursos");
  const secDisciplinas = document.getElementById("sec-disciplinas");
  const secTurmas = document.getElementById("sec-turmas");

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");

    // Deletar itens
    if (btn && btn.classList.contains("btn-excluir-instituicao")) {
      const id = btn.getAttribute("data-id");
      deletarInstituicao(id);
      return;
    } else if (btn && btn.classList.contains("btn-excluir-curso")) {
      const id = btn.getAttribute("data-id");
      deletarCurso(id);
      return;
    } else if (btn && btn.classList.contains("btn-excluir-disciplina")) {
      const id = btn.getAttribute("data-id");
      deletarDisciplina(id);
      return;
    } else if (btn && btn.classList.contains("btn-excluir-turma")) {
      const id = btn.getAttribute("data-id");
      deletarTurma(id);
      return;
    }

    // Ver cursos
    if (btn && btn.classList.contains("btn-ver-cursos")) {
      const visivel = secCursos.style.display === "flex";
      if (!visivel) {
        secCursos.style.display = "flex";
        secCursos.style.flexDirection = "column";
        btn.textContent = "Ocultar cursos";
        idIinstituicaoAtiva = btn.getAttribute("data-id");
        carregarCursos(idIinstituicaoAtiva);
      } else {
        secCursos.style.display = "none";
        btn.textContent = "Ver cursos";
        secDisciplinas.style.display = "none";
        secTurmas.style.display = "none";
      }
    }

    // Ver disciplinas
    if (btn && btn.classList.contains("btn-ver-disciplinas")) {
      const visivel = secDisciplinas.style.display === "flex";
      if (!visivel) {
        secDisciplinas.style.display = "flex";
        secDisciplinas.style.flexDirection = "column";
        btn.textContent = "Ocultar disciplinas";
        idCursoAtivo = btn.getAttribute("data-id");
        carregarDisciplinas(idCursoAtivo);
      } else {
        secDisciplinas.style.display = "none";
        btn.textContent = "Ver disciplinas";
        secTurmas.style.display = "none";
      }
    }

    // Ver turmas
    if (btn && btn.classList.contains("btn-ver-turmas")) {
      const visivel = secTurmas.style.display === "flex";
      if (!visivel) {
        secTurmas.style.display = "flex";
        secTurmas.style.flexDirection = "column";
        btn.textContent = "Ocultar turmas";
      } else {
        secTurmas.style.display = "none";
        btn.textContent = "Ver turmas";
      }
    }
  });
});
