document.addEventListener("DOMContentLoaded", () => {
/* ======== MODAL ======== */
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
else if (e.target.matches("#btn-cancelar-novo-elemento")) fecharPopup();
});

popup.addEventListener("click", (e) => {
if (e.target === popup) fecharPopup();
});

/* ======== MOSTRAR / OCULTAR SEÇÕES ======== */
const secCursos = document.getElementById("sec-cursos");
const secDisciplinas = document.getElementById("sec-disciplinas");
const secTurmas = document.getElementById("sec-turmas");

// Delegação de evento (funciona mesmo com novos botões)
document.addEventListener("click", (e) => {
// ===== Ver cursos =====
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

// ===== Ver disciplinas =====
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

// ===== Ver turmas =====
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
});