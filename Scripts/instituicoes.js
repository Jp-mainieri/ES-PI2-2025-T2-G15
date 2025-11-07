document.addEventListener("DOMContentLoaded", () => {
  /* ======== MODAL PRINCIPAL ======== */
  const popup = document.getElementById("popup-novo-elemento");
  const titulo = document.getElementById("novo-elemento-title");
  const btnConfirmar = document.getElementById("btn-confirmar-novo-elemento");
  const forms = {
    instituicao: document.getElementById("nova-instituicao-form"),
    curso: document.getElementById("novo-curso-form"),
    disciplina: document.getElementById("nova-disciplina-form"),
    turma: document.getElementById("nova-turma-form"),
  };

  let modoEdicao = false;
  let tipoAtual = "";
  let elementoEditando = null;

  function abrirPopup(tipo, edicao = false) {
    popup.style.display = "flex";
    modoEdicao = edicao;
    tipoAtual = tipo;

    titulo.textContent = edicao
      ? tipo === "instituicao"
        ? "Editar Instituição"
        : tipo === "curso"
        ? "Editar Curso"
        : tipo === "disciplina"
        ? "Editar Disciplina"
        : "Editar Turma"
      : tipo === "instituicao"
      ? "Nova Instituição"
      : tipo === "curso"
      ? "Novo Curso"
      : tipo === "disciplina"
      ? "Nova Disciplina"
      : "Nova Turma";

    Object.values(forms).forEach((f) => f.classList.remove("active"));
    forms[tipo].classList.add("active");

    if (!edicao) {
      forms[tipo].reset();
      elementoEditando = null;
    }
  }

  function fecharPopup() {
    popup.style.display = "none";
    Object.values(forms).forEach((f) => f.classList.remove("active"));
    modoEdicao = false;
    tipoAtual = "";
    elementoEditando = null;
  }

  document.addEventListener("click", (e) => {
    if (e.target.matches(".btn-nova-instituicao")) abrirPopup("instituicao");
    else if (e.target.matches("#btn-novo-curso")) abrirPopup("curso");
    else if (e.target.matches("#btn-nova-disciplina")) abrirPopup("disciplina");
    else if (e.target.matches(".btn-nova-turma")) abrirPopup("turma");
    else if (e.target.matches("#btn-cancelar-novo-elemento")) fecharPopup();
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) fecharPopup();
  });

  /* ======== MOSTRAR / OCULTAR SEÇÕES ======== */
  const secCursos = document.getElementById("sec-cursos");
  const secDisciplinas = document.getElementById("sec-disciplinas");
  const secTurmas = document.getElementById("sec-turmas");

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-ver-cursos")) {
      const visivel = secCursos.style.display === "flex";
      if (!visivel) {
        secCursos.style.display = "flex";
        secCursos.style.flexDirection = "column";
        e.target.textContent = "Ocultar cursos";
      } else {
        secCursos.style.display = "none";
        e.target.textContent = "Ver cursos";
        secDisciplinas.style.display = "none";
        secTurmas.style.display = "none";
      }
    }

    if (e.target.classList.contains("btn-ver-disciplinas")) {
      const visivel = secDisciplinas.style.display === "flex";
      if (!visivel) {
        secDisciplinas.style.display = "flex";
        secDisciplinas.style.flexDirection = "column";
        e.target.textContent = "Ocultar disciplinas";
      } else {
        secDisciplinas.style.display = "none";
        e.target.textContent = "Ver disciplinas";
        secTurmas.style.display = "none";
      }
    }

    if (e.target.classList.contains("btn-ver-turmas")) {
      const visivel = secTurmas.style.display === "flex";
      if (!visivel) {
        secTurmas.style.display = "flex";
        secTurmas.style.flexDirection = "column";
        e.target.textContent = "Ocultar turmas";
      } else {
        secTurmas.style.display = "none";
        e.target.textContent = "Ver turmas";
      }
    }
  });

  /* ======== EDIÇÃO ======== */
  document.addEventListener("click", (e) => {
    if (e.target.closest(".btn-editar-instituicao")) {
      const linha = e.target.closest("tr");
      const nome = linha.querySelector("td:first-child");
      elementoEditando = nome;
      forms.instituicao.querySelector("#input-nome-instituicao").value = nome.textContent;
      abrirPopup("instituicao", true);
    }

    if (e.target.closest(".btn-editar-curso")) {
      const linha = e.target.closest("tr");
      const nome = linha.querySelector("td:nth-child(1)");
      const codigo = linha.querySelector("td:nth-child(2)");
      elementoEditando = { nome, codigo };
      forms.curso.querySelector("#input-nome-curso").value = nome.textContent;
      forms.curso.querySelector("#input-codigo-curso").value = codigo.textContent;
      abrirPopup("curso", true);
    }

    if (e.target.closest(".btn-editar-disciplina")) {
      const linha = e.target.closest("tr");
      const nome = linha.querySelector("td:nth-child(1)");
      const sigla = linha.querySelector("td:nth-child(2)");
      const codigo = linha.querySelector("td:nth-child(3)");
      const periodo = linha.querySelector("td:nth-child(4)");
      elementoEditando = { nome, sigla, codigo, periodo };
      forms.disciplina.querySelector("#input-nome-disciplina").value = nome.textContent;
      forms.disciplina.querySelector("#input-sigla-disciplina").value = sigla.textContent;
      forms.disciplina.querySelector("#input-codigo-disciplina").value = codigo.textContent;
      forms.disciplina.querySelector("#input-periodo-disciplina").value = periodo.textContent;
      abrirPopup("disciplina", true);
    }

    if (e.target.closest(".btn-editar-turma")) {
      const linha = e.target.closest("tr");
      const nome = linha.querySelector("td:nth-child(1)");
      const codigo = linha.querySelector("td:nth-child(2)");
      const turno = linha.querySelector("td:nth-child(3)");
      elementoEditando = { nome, codigo, turno };
      forms.turma.querySelector("#input-nome-turma").value = nome.textContent;
      forms.turma.querySelector("#input-codigo-turma").value = codigo.textContent;
      forms.turma.querySelector("#input-turno-turma").value = turno.textContent;
      abrirPopup("turma", true);
    }
  });

  /* ======== SALVAR EDIÇÃO ======== */
  btnConfirmar.addEventListener("click", () => {
    if (!modoEdicao || !tipoAtual) {
      fecharPopup();
      return;
    }

    switch (tipoAtual) {
      case "instituicao":
        elementoEditando.textContent = forms.instituicao.querySelector("#input-nome-instituicao").value;
        break;

      case "curso":
        elementoEditando.nome.textContent = forms.curso.querySelector("#input-nome-curso").value;
        elementoEditando.codigo.textContent = forms.curso.querySelector("#input-codigo-curso").value;
        break;

      case "disciplina":
        elementoEditando.nome.textContent = forms.disciplina.querySelector("#input-nome-disciplina").value;
        elementoEditando.sigla.textContent = forms.disciplina.querySelector("#input-sigla-disciplina").value;
        elementoEditando.codigo.textContent = forms.disciplina.querySelector("#input-codigo-disciplina").value;
        elementoEditando.periodo.textContent = forms.disciplina.querySelector("#input-periodo-disciplina").value;
        break;

      case "turma":
        elementoEditando.nome.textContent = forms.turma.querySelector("#input-nome-turma").value;
        elementoEditando.codigo.textContent = forms.turma.querySelector("#input-codigo-turma").value;
        elementoEditando.turno.textContent = forms.turma.querySelector("#input-turno-turma").value;
        break;
    }

    fecharPopup();
  });

  /* ======== MODAL DE EXCLUSÃO ======== */
  const modalExcluir = document.createElement("div");
  modalExcluir.classList.add("modal");
  modalExcluir.innerHTML = `
    <div class="modal-content">
      <h2>Confirmação</h2>
      <p> Deseja realmente excluir este item?</p>
      <div class="modal-buttons">
        <button id="btn-confirmar-excluir" class="confirmar">Excluir</button>
        <button id="btn-cancelar-excluir" class="cancelar">Cancelar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modalExcluir);

  let elementoParaExcluir = null;

  document.addEventListener("click", (e) => {
    if (e.target.closest(".btn-excluir")) {
      elementoParaExcluir = e.target.closest("tr");
      modalExcluir.style.display = "flex";
    }
  });

  modalExcluir.addEventListener("click", (e) => {
    if (e.target === modalExcluir || e.target.id === "btn-cancelar-excluir") {
      modalExcluir.style.display = "none";
      elementoParaExcluir = null;
    }
  });

  document.getElementById("btn-confirmar-excluir").addEventListener("click", () => {
    if (elementoParaExcluir) {
      elementoParaExcluir.remove();
    }
    modalExcluir.style.display = "none";
  });
});
