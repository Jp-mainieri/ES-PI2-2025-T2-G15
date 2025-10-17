document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup-novo-elemento");
    const titulo = document.getElementById("novo-elemento-title");
    const forms = {
      instituicao: document.getElementById("nova-instituicao-form"),
      disciplina: document.getElementById("nova-disciplina-form"),
      turma: document.getElementById("nova-turma-form")
    };
  
    // === Abrir Popup ===
    function abrirPopup(tipo) {
      popup.style.display = "flex";
  
      titulo.textContent =
        tipo === "instituicao" ? "Nova Instituição" :
        tipo === "disciplina" ? "Nova Disciplina" :
        "Nova Turma";
  
      Object.values(forms).forEach(f => f.classList.remove("active"));
      forms[tipo].classList.add("active");
    }
  
    // === Fechar Popup ===
    function fecharPopup() {
      popup.style.display = "none";
      Object.values(forms).forEach(f => f.classList.remove("active"));
    }
  
    // === Eventos de abertura ===
    document.addEventListener("click", e => {
      if (e.target.matches(".btn-nova-instituicao")) abrirPopup("instituicao");
      else if (e.target.matches("#btn-nova-disciplina")) abrirPopup("disciplina");
      else if (e.target.matches(".btn-nova-turma")) abrirPopup("turma");
      else if (e.target.matches("#btn-cancelar-novo-elemento")) fecharPopup();
    });
  
    // === Fechar ao clicar fora ===
    popup.addEventListener("click", e => {
      if (e.target === popup) fecharPopup();
    });
  });


  document.addEventListener("DOMContentLoaded", () => {
    const secDisciplinas = document.getElementById("sec-disciplinas");
    const secTurmas = document.getElementById("sec-turmas");
  
    // Seleciona TODOS os botões de ver disciplinas
    document.querySelectorAll(".btn-ver-disciplinas").forEach(botao => {
      botao.addEventListener("click", () => {
        const estaVisivel = secDisciplinas.style.display === "flex";
        if (!estaVisivel) {
          secDisciplinas.style.display = "flex";
          secDisciplinas.style.flexDirection = "column";
          botao.textContent = "Ocultar disciplinas";
        } else {
          secDisciplinas.style.display = "none";
          botao.textContent = "Ver disciplinas";
          // Esconde também as turmas se estiverem abertas
          secTurmas.style.display = "none";
          document.querySelectorAll(".btn-ver-turmas").forEach(btn => btn.textContent = "Ver turmas");
        }
      });
    });
  
    // Seleciona TODOS os botões de ver turmas
    document.querySelectorAll(".btn-ver-turmas").forEach(botao => {
      botao.addEventListener("click", () => {
        const estaVisivel = secTurmas.style.display === "flex";
        if (!estaVisivel) {
          secTurmas.style.display = "flex";
          secTurmas.style.flexDirection = "column";
          botao.textContent = "Ocultar turmas";
        } else {
          secTurmas.style.display = "none";
          botao.textContent = "Ver turmas";
        }
      });
    });
  });
  