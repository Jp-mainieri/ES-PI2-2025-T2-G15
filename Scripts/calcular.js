// Feito por João Pedro Panza Mainieri - 25006642

// Base da API
const API_URL = "http://localhost:3000"

// Usuário logado
const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const idProfessor = usuarioLogado.id_professor;



// Dados
let instituicoesData = [];
let cursosData = [];
let disciplinasData = [];
let formulaData;
let variaveisFormulaData = [];
let componentesNotasData = [];
let idInstituicaoAtiva;
let idCursoAtivo;
let idDisciplinaAtiva = -1;

// Função para carregar as instituções pelo professor do banco de dados
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

// Função para renderizar as opções de instituições no select
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

// Função para carregar os cursos pela instituição do banco de dados
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

// Função para renderizar as opções de cursos no select
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

// Função para carregar as disciplinas pelo curso do banco de dados
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

// Função para renderizar as opções de disciplinas no select
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

// Função para carregar a formula pelo disciplina do banco de dados
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

// Função para renderizar a formula da disciplinas no input
function renderizarFormula() {
    const inputFormula = document.querySelector("#formula");
    if (!inputFormula) return;
    inputFormula.value = formulaData?.FORMULA || "";
}

// Função para adicionar a formula da disciplina no banco de dados
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

// Função para editar a formula da disciplina no banco de dados
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

// Função para carregar os componentes de nota da disciplina no banco de dados
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

// Função para renderizar os componentes de nota da disciplina na tabela dos combonentes
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

// Função para renderizar a linha com os inputs para adicionar um novo componente
async function renderizarAdicionarComponente(){
    const tabela = document.getElementById("tabela-componentes");
    if (!tabela || idDisciplinaAtiva === -1) {
        alert("Selecione uma disciplina antes de adicionar um componente");
        return;
    }

    await carregarComponentes();

    const nova_linha = document.createElement("tr");
    nova_linha.innerHTML = `
        <td><input type="text" class="novo-nome" placeholder="NOME"></td>
        <td><input type="text" class="novo-sigla" placeholder="SIGLA"></td>
        <td><input type="text" class="novo-descricao" placeholder="Descricao"></td>
    `;
    tabela.appendChild(nova_linha);
}

// Função para adicionar componente de nota no banco de dados
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

// Função para editar componente de nota no banco de dados
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

// Função para editar componente de nota na tabela dos componentes
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

// Função para excluir componente de nota no banco de dados
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

// Função para excluir componente de nota na tabela dos componentes
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



// Função para verificar se a formula é valida
async function verificarFormula(formula) {
    // Verificar se na formula tem todos os componentes da disciplina
    
    try {
        // Carrega os componentes se ainda não estiverem carregados
        if (componentesNotasData.length === 0) {
            await carregarComponentes();
        }
        
        if (componentesNotasData.length === 0) {
            variaveisFormulaData = [];
            return true;
        }
        
        let variaveisFormula = [];
        // Verifica se cada componente está presente na fórmula
        for (const componente of componentesNotasData) {
            if (!formula.includes(`$${componente.SIGLA}`)) {
                alert(`Fórmula Inválida`);
                return false;
            }else {
                variaveisFormula.push(componente.SIGLA)
            }
        }
        variaveisFormulaData = variaveisFormula; 
        return true;
    } catch (error) {
        console.error("Erro ao verificar fórmula:", error);
        return false;
    }
}

// Função para validar a partir da verificação da formula se ela é valida
async function validarFormula(){
    const inputFormula = document.querySelector("#formula").value;
    console.log(inputFormula);

    if (!inputFormula || inputFormula.length === 0) {
        alert("Formula: Nada para validar");
        return;
    }

    if (await verificarFormula(inputFormula) && validarExpressao(inputFormula)){
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

// Função para validar a expressão matemática da formula
function validarExpressao(formula) {
    if (!formula) return false;

    let expressao = formula;

    // Substitui todas as variáveis por 1
    variaveisFormulaData.forEach(sigla => {
        const nomeVariavel = `$${sigla}`;
        expressao = expressao.replaceAll(nomeVariavel, "1");
    });
    
    try {
        // Cria função que retorna o valor da expressão
        const fn = new Function(`return (${expressao});`);
        const testarFormula = fn();

        if (typeof testarFormula !== "number" || isNaN(testarFormula)) {
            alert("A fórmula não resulta em um valor numérico válido.");
            return false;
        }
    } catch (error) {
        console.error(error);
        alert("A fórmula é matematicamente inválida (parênteses ou operadores incorretos).");
        return false;
    }

    return true;
}

// Select instituições
const selectsInstituicao = document.getElementsByClassName("sortInstituicao");
for (const select of selectsInstituicao) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idInstituicaoAtiva = e.target.value;
        await carregarCursos();
    });
}

// Select Cursos
const selectsCurso = document.getElementsByClassName("sortCurso");
for (const select of selectsCurso) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idCursoAtivo = e.target.value;
        await carregarDisciplinas();
    });
}

// Select Disciplina
const selectsDisciplina = document.getElementsByClassName("sortDisciplina");
for (const select of selectsDisciplina) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idDisciplinaAtiva = e.target.value;
        await carregarComponentes();
        await carregarFormula();
    });
}

// Botão para validar a formula inserida
document.getElementById("btn-validar-formula").addEventListener("click", async (e)=> {
    e.preventDefault();
    await validarFormula();
});

// Botão para adicionar o componente de nota
document.getElementById("btn-adc-componente").addEventListener("click", async (e) =>{
    e.preventDefault();
    await renderizarAdicionarComponente();
})

// Botão para salvar alterações nos componentes e verificar se a formula continua correta
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

// Inicialização
carregarInstituicoes();