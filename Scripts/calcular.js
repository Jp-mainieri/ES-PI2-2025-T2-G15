const API_URL = "http://localhost:3000"

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const idProfessor = usuarioLogado.id_professor;

let idInstituicaoAtiva;
let idCursoAtivo;
let idDisciplinaAtiva;

let instituicoesData = [];
let cursosData = [];
let disciplinasData = [];
let formulaData;

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

function renderizarOpcoesInstituicoes() {
    const selects = document.querySelectorAll(".sortInstituicao");
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

async function carregarCursos() {
    try {
        const response = await fetch(`${API_URL}/cursos/instituicao/${idInstituicaoAtiva}`)
        if (!response.ok) throw new Error("Erro ao carregar turmas");

        cursosData = await response.json();
        renderizarOpcoesCursos();
    } catch (error) {
        console.error("Erro:", error);
    }
}

function renderizarOpcoesCursos() {
    const selects = document.querySelectorAll(".sortCurso");
    if (!selects) return;

    selects.forEach(sessao => {
        const opcoesExistentes = sessao.querySelectorAll("option:not(:first-child)");
        opcoesExistentes.forEach((opcao) => opcao.remove());

        cursosData.forEach((curso) => {
            const nova_opcao = document.createElement('option');
            nova_opcao.value = curso.id;
            nova_opcao.textContent = curso.NOME;
            sessao.appendChild(nova_opcao);
        });
    })

}

async function carregarDisciplinas() {
    try {
        const response = await fetch(`${API_URL}/disciplinas/curso/${idCursoAtivo}`)
        if (!response.ok) throw new Error("Erro ao carregar turmas");

        disciplinasData = await response.json();
        renderizarOpcoesDisciplinas();
    } catch (error) {
        console.error("Erro:", error);
    }
}

function renderizarOpcoesDisciplinas() {
    const selects = document.querySelectorAll(".sortDisciplina");
    if (!selects) return;

    selects.forEach(sessao => {
        const opcoesExistentes = sessao.querySelectorAll("option:not(:first-child)");
        opcoesExistentes.forEach((opcao) => opcao.remove());

        disciplinasData.forEach((disc) => {
            const nova_opcao = document.createElement('option');
            nova_opcao.value = disc.id;
            nova_opcao.textContent = disc.NOME;
            sessao.appendChild(nova_opcao);
        });
    })
};

async function carregarFormula() {
    try {
        const response = await fetch(`${API_URL}/formula/${idDisciplinaAtiva}`)
        if (!response.ok) throw new Error("Erro ao carregar formulas");
        try {
            formulaData = await response.json();
        }catch {
            formulaData = null;
        }
        renderizarFormula();
    } catch (error) {
        console.error("Erro:", error);
    }
}

function renderizarFormula() {
    const inputFormula = document.querySelector("#formula");
    if (!inputFormula) return;
    inputFormula.value = formulaData?.FORMULA || "";
}

async function adicionarFormula(formula){
    try {
        alert("ADCND")
        const response = await fetch(`${API_URL}/formula`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_disciplina: Number(idDisciplinaAtiva),
                formula,
            }),
        });

        if (!response.ok) throw new Error("Erro ao adicionar formula");
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao adicionar formula: " + error.message);
    }
}

async function editarFormula(id, formula) {
    try {
        const response = await fetch(`${API_URL}/formula/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                formula
            }),
        });

        if (!response.ok) throw new Error("Erro ao atualizar formula");
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao atualizar formula: " + error.message);
    }
}

carregarInstituicoes();

const selectsInstituicao = document.getElementsByClassName("sortInstituicao");
for (const select of selectsInstituicao) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idInstituicaoAtiva = e.target.value;
        await carregarCursos();
    });
}
const selectsCurso = document.getElementsByClassName("sortCurso");
for (const select of selectsCurso) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idCursoAtivo = e.target.value;
        await carregarDisciplinas();
    });
}
const selectsDisciplina = document.getElementsByClassName("sortDisciplina");
for (const select of selectsDisciplina) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idDisciplinaAtiva = e.target.value;
        //await carregarComponentes();
        await carregarFormula();
    });
}
document.getElementById("btn-validar-formula").addEventListener("click", async (e)=>{
    e.preventDefault();
    const inputFormula = document.querySelector("#formula").value;
    console.log(inputFormula);
    if (!inputFormula || inputFormula.length === 0) {
        alert("Nada para validar");
        return;
    }
    console.log(formulaData)
    if (!formulaData || !formulaData.ID_FORMULA) {
        await adicionarFormula(inputFormula);
        alert("Fórmula adicionada com sucesso!");
    } else if (inputFormula !== formulaData.FORMULA) {
        await editarFormula(formulaData.ID_FORMULA, inputFormula);
        alert("Fórmula atualizada com sucesso!");
    } else {
        alert("A fórmula já está atualizada.");
    }

    console.log(idDisciplinaAtiva)
    await carregarFormula()
    console.log(formulaData)
});