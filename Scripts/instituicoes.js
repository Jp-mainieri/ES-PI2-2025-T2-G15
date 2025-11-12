const API_URL = "http://localhost:3000";

let instituicoesData = [];
let cursosData = [];
let disciplinasData = [];
let turmasData = [];


//Serve para guardar o id do que está em exibição
const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const idProfessor = usuarioLogado.id_professor;
let idIinstituicaoAtiva;
let idCursoAtivo;
let idDisciplinaAtiva;

// Funções para o FETCH

async function carregarInstituicoes() {
  try {
    const response = await fetch(`${API_URL}/instituicoes/professor/${idProfessor}`);
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
  if (instituicoesData[0] === undefined) {
      const nova_linha = document.createElement("tr");
      nova_linha.innerHTML = `
      <td>Nenhuma instituicão cadastrada</td>
      `;
      tabela.appendChild(nova_linha);
  }
  instituicoesData.forEach((inst) => {
    const nova_linha = document.createElement("tr");
    nova_linha.innerHTML = `
      <td>${inst.NOME}</td>
      <td>
        <div class="tabela-acoes">
          <div class="tabela-botoes">
            <button class="btn-ver-cursos" data-id="${inst.id}">Ver cursos</button>
            <!--<button class="btn-editar-instituicao" data-id="${inst.id}"><i class="fa-solid fa-pen"></i></button>-->
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
    if (cursosData[0] === undefined) {
        const nova_linha = document.createElement("tr");
        nova_linha.innerHTML = `
      <td>Nenhum curso cadastrado para esta instituição</td>
      `;
        tabela.appendChild(nova_linha);
    }
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
            <!--<button class="btn-editar-curso" data-id="${
              curso.id
            }"><i class="fa-solid fa-pen"></i></button>-->
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
    if (disciplinasData[0] === undefined) {
        const nova_linha = document.createElement("tr");
        nova_linha.innerHTML = `
      <td>Nenhuma disciplina cadastrada para este curso</td>
      `;
        tabela.appendChild(nova_linha);
    }
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
              disc.id
            }">Ver turmas</button>
            <!--<button class="btn-editar-disciplina" data-id="${
              disc.id
            }"><i class="fa-solid fa-pen"></i></button>-->
            <button class="btn-excluir-disciplina" data-id="${
              disc.id
            }"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      </td>
    `;
    tabela.appendChild(nova_linha);
  });
}

async function carregarTurmas(id_disciplina) {
  try {
    const response = await fetch(`${API_URL}/turmas/disciplina/${id_disciplina}`)
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
    if (turmasData[0] === undefined) {
        const nova_linha = document.createElement("tr");
        nova_linha.innerHTML = `
      <td>Nenhuma turma cadastrada para esta disciplina</td>
      `;
        tabela.appendChild(nova_linha);
    }
  turmasData.forEach((turma) => {
      let turnoTurma;
      switch (turma.TURNO) {
          case 1:
              turnoTurma = "MATUTINO";
              break;
          case 2:
              turnoTurma = "VESPERTINO";
              break;
          case 3:
              turnoTurma = "NOTURNO";
              break;
          case 4:
              turnoTurma = "INTEGRAL";
              break;
          default:
              turnoTurma = "INVÁLIDO";
      }
    const nova_linha = document.createElement("tr");
    nova_linha.innerHTML = `
      <td>${turma.nome}</td>
      <td>${turma.CODIGO}</td>
      <td>${turnoTurma}</td>
      <td>
        <div class="tabela-acoes">
          <div class="tabela-botoes">
            <!--<button class="btn-editar-turma" data-id="${turma.id}"><i class="fa-solid fa-pen"></i></button>-->
            <button class="btn-excluir-turma" data-id="${turma.id}"><i class="fa-solid fa-trash"></i></button>
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
      body: JSON.stringify({ nome, id_professor: idProfessor }),// preciso colocar o id_professor de acordo com o login
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
        periodo: Number(periodoNumber),
        id_curso: idCursoAtivo,
      }),
    });

    if (!response.ok) throw new Error("Erro ao adicionar disciplina");

    alert("Disciplina adicionada com sucesso!");
    await carregarDisciplinas(idCursoAtivo);
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao adicionar disciplina: " + error.message);
  }
}

async function adicionarTurma(nome, codigo, turno) {
    let turnoNumber;
    switch (turno) {
        case "MATUTINO":
            turnoNumber = 1;
            break;
        case "VESPERTINO":
            turnoNumber = 2;
            break;
        case "NOTURNO":
            turnoNumber = 3;
            break;
        case "INTEGRAL":
            turnoNumber = 4;
            break;
        default:
            turnoNumber = 5;
    }
  try {
    const response = await fetch(`${API_URL}/turmas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          nome,
          codigo,
          turno: turnoNumber,
          id_disciplina: idDisciplinaAtiva
          }),
    });

    if (!response.ok) throw new Error("Erro ao adicionar turma");

    alert("Turma adicionada com sucesso!");
    await carregarTurmas(idDisciplinaAtiva);
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao adicionar turma: " + error.message);
  }
}

async function deletarInstituicao(id) {
  if (!confirm("Tem certeza que deseja deletar esta instituição?")) return;

  try {
      const conteudo = await fetch(`${API_URL}/cursos/instituicao/${id}`)
      if (conteudo) {
          alert("Ainda tem cursos cadastrados nesta instituicão");
          return;
      }
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
      const conteudo = await fetch(`${API_URL}/disciplinas/curso/${id}`)
      if (conteudo) {
          alert("Ainda tem disciplinas cadastrados neste curso");
          return;
      }
    const response = await fetch(`${API_URL}/cursos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao deletar curso");

    alert("Curso deletado com sucesso!");
    await carregarCursos(idIinstituicaoAtiva);
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao deletar curso: " + error.message);
  }
}

async function deletarDisciplina(id) {
  if (!confirm("Tem certeza que deseja deletar esta disciplina?")) return;

  try {
      const conteudo = await fetch(`${API_URL}/turmas/disciplina/${id}`)
      if (conteudo) {
          alert("Ainda tem turmas cadastrados nesta disciplina");
          return;
      }
    const response = await fetch(`${API_URL}/disciplinas/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao deletar disciplina");

    alert("Disciplina deletada com sucesso!");
    await carregarDisciplinas(idCursoAtivo);
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao deletar disciplina: " + error.message);
  }
}

async function deletarTurma(id) {
  if (!confirm("Tem certeza que deseja deletar esta turma?")) return;
  try {
      const conteudo = await fetch(`${API_URL}/alunos/turma/${id}`)
      if (conteudo) {
          alert("Ainda tem alunos cadastrados nesta turma");
          return;
      }
    const response = await fetch(`${API_URL}/turmas/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao deletar turma");

    alert("Turma deletada com sucesso!");
    await carregarTurmas(idDisciplinaAtiva);
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao deletar turma: " + error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  /* ======== MODAL ======== */

  // Carrega as instituições referentes ao professor
  carregarInstituicoes();

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
    const nome = e.target.querySelector('input[name="nome"]').value;
    const codigo = e.target.querySelector('input[name="codigo"]').value;
    const turno = e.target.querySelector('input[name="turno"]').value;
    await adicionarTurma(nome, codigo, turno);
    fecharPopup();
    e.target.reset();
  });

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

    // BOTÃO VER ...

    // Ver cursos
    if (btn && btn.classList.contains("btn-ver-cursos")) {
      const visivel = secCursos.style.display === "flex";
      if (!visivel) {
        btn.textContent = "Ocultar cursos";
        idIinstituicaoAtiva = btn.getAttribute("data-id");
        carregarCursos(idIinstituicaoAtiva);
        secCursos.style.display = "flex";
        secCursos.style.flexDirection = "column";
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
        btn.textContent = "Ocultar disciplinas";
        idCursoAtivo = btn.getAttribute("data-id");
        carregarDisciplinas(idCursoAtivo);
        secDisciplinas.style.display = "flex";
        secDisciplinas.style.flexDirection = "column";
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
        btn.textContent = "Ocultar turmas";
        idDisciplinaAtiva = btn.getAttribute("data-id");
        carregarTurmas(idDisciplinaAtiva);
        secTurmas.style.display = "flex";
        secTurmas.style.flexDirection = "column";
      } else {
        secTurmas.style.display = "none";
        btn.textContent = "Ver turmas";
      }
    }
  });
});
