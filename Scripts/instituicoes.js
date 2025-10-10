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
  