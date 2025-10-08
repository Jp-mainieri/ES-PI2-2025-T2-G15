document.addEventListener("DOMContentLoaded", () => {
    const popup = document.querySelector(".novo-elemento-popup");
    const titulo = document.getElementById("novo-elemento-title");
    const forms = {
        instituicao: document.getElementById("nova-instituicao-form"),
        disciplina: document.getElementById("nova-disciplina-form"),
        turma: document.getElementById("nova-turma-form")
    };

    popup.style.display = "none";

    function abrirPopup(tipo) {
        popup.style.display = "block";
        titulo.textContent = `Nova ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;

        Object.values(forms).forEach(f => f.style.display = "none");
        forms[tipo].style.display = "flex";
    }

    function fecharPopup() {
        popup.style.display = "none";
        Object.values(forms).forEach(f => f.style.display = "none");
    }

    document.addEventListener("click", e => {
        if (e.target.matches(".btn-nova-instituicao")) abrirPopup("instituicao");
        else if (e.target.matches("#btn-nova-disciplina")) abrirPopup("disciplina");
        else if (e.target.matches(".btn-nova-turma")) abrirPopup("turma");
        else if (e.target.matches("#btn-cancelar-novo-elemento")) fecharPopup();
    });

    // Fechar ao clicar fora do conteúdo do popup
    popup.addEventListener("click", e => {
        if (e.target === popup) fecharPopup();
    });

    function abrirPopup(tipo) {
    popup.style.display = "block";

    switch(tipo) {
        case "instituicao":
            titulo.textContent = "Nova Instituição"; 
        case "disciplina":
            titulo.textContent = "Nova Disciplina";
            break;
        case "turma":
            titulo.textContent = "Nova Turma";
            break;
    }

    Object.values(forms).forEach(f => f.style.display = "none");
    forms[tipo].style.display = "flex";
}

});
