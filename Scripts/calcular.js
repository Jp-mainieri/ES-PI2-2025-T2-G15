const API_URL = "http://localhost:3000"

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const idProfessor = usuarioLogado.id_professor;

let idInstituicaoAtiva;
let idCursoAtivo;
let idDisciplinaAtiva = -1;

let instituicoesData = [];
let cursosData = [];
let disciplinasData = [];
let formulaData;
let componentesNotasData = [];

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
}

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

async function editarFormula(formula) {
    try {
        const response = await fetch(`${API_URL}/formula/${idDisciplinaAtiva}`, {
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

async function carregarComponentes() {
    try {
        const response = await fetch(`${API_URL}/componente-nota/disciplina/${idDisciplinaAtiva}`)
        if (!response.ok) throw new Error("Erro ao carregar componentes");
        componentesNotasData = await response.json();
        renderizarComponentes();
    } catch (error) {
        console.error("Erro:", error);
    }
}

function renderizarComponentes() {
    const tabela = document.getElementById("tabela-componentes");
    if (!tabela) return;

    // Remove linhas existentes
    const linhasExistentes = tabela.querySelectorAll("tr:not(:first-child)");
    linhasExistentes.forEach(linha => linha.remove());

    componentesNotasData.forEach(comp => {
        const novaLinha = document.createElement("tr");
        novaLinha.dataset.id = comp.ID_COMPONENTE;
        novaLinha.innerHTML = `
            <td class="td-nome">${comp.NOME}</td>
            <td class="td-sigla">${comp.SIGLA}</td>
            <td class="td-descricao">${comp.DESCRICAO || "N/A"}</td>
            <td class="acoes">
                <button class="btn-acao btn-editar" data-id="${comp.ID_COMPONENTE}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-acao btn-excluir" data-id="${comp.ID_COMPONENTE}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tabela.appendChild(novaLinha);
    });

    adicionarEventosEditar();
    adicionarEventosExcluir();
}


async function renderizarAdicionarComponente(){
    const tabela = document.getElementById("tabela-componentes");
    if (!tabela || idDisciplinaAtiva === -1) return;

    await carregarComponentes();

    const nova_linha = document.createElement("tr");
    nova_linha.innerHTML = `
        <td><input type="text" class="novo-nome" placeholder="NOME"></td>
        <td><input type="text" class="novo-sigla" placeholder="SIGLA"></td>
        <td><input type="text" class="novo-descricao" placeholder="Descricao"></td>
    `;
    tabela.appendChild(nova_linha);
}


async function adicionarComponente(nome, sigla,descricao){
    try {
        const response = await fetch(`${API_URL}/componente-nota`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome,
                sigla,
                descricao,
                id_disciplina: Number(idDisciplinaAtiva),
            }),
        });

        if (!response.ok) throw new Error("Erro ao adicionar componente");
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao adicionar componente: " + error.message);
    }
}

async function editarComponente(id, nome, sigla, descricao) {
    try {
        const response = await fetch(`${API_URL}/componente-nota/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ nome, sigla, descricao }),
        });
        if (!response.ok) throw new Error("Erro ao atualizar componente");
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao atualizar componente: " + error.message);
    }
}

function adicionarEventosEditar() {
    const botoesEditar = document.getElementsByClassName("btn-editar");

    for (const botao of botoesEditar) {
        botao.addEventListener("click", (e) => {
            const linha = e.target.closest("tr");

            // Converte células em inputs
            linha.cells[0].innerHTML = `<input type="text" value="${linha.cells[0].textContent}" class="edit-nome">`;
            linha.cells[1].innerHTML = `<input type="text" value="${linha.cells[1].textContent}" class="edit-sigla">`;
            linha.cells[2].innerHTML = `<input type="text" value="${linha.cells[2].textContent === "N/A" ? "" : linha.cells[2].textContent}" class="edit-descricao">`;
        });
    }
}

async function excluirComponente(id) {
    try {
        const response = await fetch(`${API_URL}/componente-nota/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao excluir componente");
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao excluir componente: " + error.message);
    }
}

function adicionarEventosExcluir() {
    const botoesExcluir = document.getElementsByClassName("btn-excluir");

    for (const botao of botoesExcluir) {
        botao.addEventListener("click", (e) => {
            const linha = e.target.closest("tr");
            linha.dataset.excluir = "true"; // marca para excluir
            linha.style.display = "none"; // esconde da tabela
        });
    }
}



async function verificarFormula(formula) {
    // Verificar se na formula tem todos os componentes da disciplina
    if (!formula) return false;
    
    try {
        // Carrega os componentes se ainda não estiverem carregados
        if (componentesNotasData.length === 0) {
            await carregarComponentes();
        }

        if (componentesNotasData.length === 0) {
            return true;
        }

        // Verifica se cada componente está presente na fórmula
        for (const componente of componentesNotasData) {
            if (!formula.includes(`$${componente.SIGLA}`)) {
                alert(`Um ou mais componentes faltando na formula.`);
                return false;
            }
        }
        return true;
    } catch (error) {
        console.error("Erro ao verificar fórmula:", error);
        return false;
    }
}

async function validarFormula(){
    const inputFormula = document.querySelector("#formula").value;
    console.log(inputFormula);

    if (!inputFormula || inputFormula.length === 0) {
        alert("Nada para validar");
        return;
    }

    if (await verificarFormula(inputFormula)){
        if (!formulaData || !formulaData.ID_FORMULA) {
            await adicionarFormula(inputFormula);
            alert("Fórmula adicionada com sucesso!");
        } else if (inputFormula !== formulaData.FORMULA) {
            await editarFormula(inputFormula);
            alert("Fórmula atualizada com sucesso!");
        }
    }

    await carregarFormula()
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
        await carregarComponentes();
        await carregarFormula();
    });
}
document.getElementById("btn-validar-formula").addEventListener("click", async (e)=> {
    e.preventDefault();
    await validarFormula();
});

document.getElementById("btn-adc-componente").addEventListener("click", async (e) =>{
    e.preventDefault();
    await renderizarAdicionarComponente();
})

document.getElementById("btn-salvar-alteracoes").addEventListener("click", async (e) => {
    e.preventDefault();

    const linhas = document.querySelectorAll("#tabela-componentes tr:not(:first-child)");

    for (const linha of linhas) {
        const id = linha.dataset.id;

        // Se a linha foi marcada para exclusão
        if (linha.dataset.excluir === "true") {
            if (id) await excluirComponente(id);
            linha.remove(); // Remove da tabela imediatamente
            continue;
        }

        const inputNome = linha.querySelector(".edit-nome");
        const inputSigla = linha.querySelector(".edit-sigla");
        const inputDescricao = linha.querySelector(".edit-descricao");

        // Edição de componente existente
        if (inputNome && inputSigla) {
            const novoNome = inputNome.value.trim();
            const novaSigla = inputSigla.value.trim().toUpperCase();
            const novaDescricao = inputDescricao.value.trim();

            if (!novoNome || !novaSigla) {
                alert("Nome e sigla obrigatórios!");
                continue;
            }

            await editarComponente(id, novoNome, novaSigla, novaDescricao);
        } else {
            // Novos componentes adicionados
            const novoNome = linha.querySelector(".novo-nome")?.value.trim();
            const novaSigla = linha.querySelector(".novo-sigla")?.value.trim().toUpperCase();
            const novaDescricao = linha.querySelector(".novo-descricao")?.value.trim();

            if (novoNome && novaSigla) {
                await adicionarComponente(novoNome, novaSigla, novaDescricao);
            }
        }
    }

    // Recarrega tabela e valida fórmula
    await carregarComponentes();
    await validarFormula();
});



