// Feito por João Pedro Panza Mainieri - 25006642

// Base da API
const API_URL = "http://localhost:3000";

// Usuário logado
const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const idProfessor = usuarioLogado.id_professor;

// Dados
let idInstituicaoAtiva;
let idCursoAtivo;
let idDisciplinaAtiva;
let idTurmaAtiva;
let instituicoesData = [];
let cursosData = [];
let disciplinasData = [];
let turmasData = [];
let notasAlunosData = [];
let componentesNotasData = [];
let formulaData;
let modoEdicaoCompleta = false;
let modoEdicaoPorComponente = false;
let componenteEmEdicao = null;

// Carregar Insituições do banco de dados
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

// Renderizar opções de Insituições no select
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

// Carregar Cursos do banco de dados
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

// Renderizar opções de Cursos no select
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
// Carregar Disciplinas do banco de dados
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

// Renderizar opções de Disciplinas no select
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

// Carregar Turmas do banco de dados
async function carregarTurmas() {
    try {
        const response = await fetch(`${API_URL}/turmas/disciplina/${idDisciplinaAtiva}`)
        if (!response.ok) throw new Error("Erro ao carregar turmas");
        
        turmasData = await response.json();
        renderizarOpcoesTurmas();
    } catch (error) {
        console.error("Erro:", error);
    }
}

// Renderizar opções de Turmas no select
function renderizarOpcoesTurmas() {
    const selects = document.querySelectorAll(".sortTurma");
    if (!selects) return;

    selects.forEach(sessao => {
        const opcoesExistentes = sessao.querySelectorAll("option:not(:first-child)");
        opcoesExistentes.forEach((opcao) => opcao.remove());

        turmasData.forEach((turma) => {
            const nova_opcao = document.createElement('option');
            nova_opcao.value = turma.id;
            nova_opcao.textContent = turma.nome;
            sessao.appendChild(nova_opcao);
        });
    })

}

// Carrega a tabela alunos, com as notas por componente do banco de dados
async function carregarTabelaAlunosNotas() {
    try {
        const notas = await fetch(`${API_URL}/notas/turma/${idTurmaAtiva}`)
        const componentes = await fetch(`${API_URL}/componente-nota/disciplina/${idDisciplinaAtiva}`)
        
        if (!notas.ok || !componentes.ok) throw new Error("Erro ao carregar notas ou componentes");
        notasAlunosData = await notas.json();
        componentesNotasData = await componentes.json();
        renderizarNotasAlunos();
    }catch (error) {
        console.error("Erro:", error);
    }
}

// Renderiza a tabela alunos, com as notas por componente
function renderizarNotasAlunos() {
    const tabela = document.getElementById("tabela-notas");
    const thead = tabela.querySelector("thead");
    const tbody = tabela.querySelector("tbody");

    limparTabelaNotasAlunos();

    // Se não tiver data dos alunos ou das notas
    if (!notasAlunosData || notasAlunosData.length === 0) {
        tbody.innerHTML = `
      <td>Nenhum aluno para a turma ou componente de nota para a disciplina encontrado</td>
      `;
        document.getElementById("btn-exportar").style.display="none";
        document.getElementById("btn-editar-notas").style.display="none";
        document.getElementById("btn-editar-por-componente").style.display = "none";
        document.getElementById("select-componente").style.display = "none";
        document.getElementById("btn-salvar").style.display = "none";
        return;
    }

    thead.innerHTML = `
        <tr>
            <th>RA</th>
            <th>NOME</th>
            ${componentesNotasData.map(c => `<th>${c.NOME}</th>`).join('')}
            <th>MEDIA FINAL</th>
        </tr>
    `;

    // Agrupa notas por RA do aluno no objeto alunosMap
    const alunosMap = {};
    for (const n of notasAlunosData) {
        if (!alunosMap[n.RA_ALUNO]) {
            alunosMap[n.RA_ALUNO] = { nome: n.NOME, notas: {} };
        }
        alunosMap[n.RA_ALUNO].notas[n.ID_COMPONENTE] = n.VALOR;
    }

    // Para montar o corpo da tabla
    for (const [ra, dados] of Object.entries(alunosMap)) {
        const linha = document.createElement("tr");

        let html = `
            <td>${ra}</td>
            <td>${dados.nome}</td>
        `;

        html += componentesNotasData.map(c => {
            const valorBruto = dados.notas[c.ID_COMPONENTE];
            const valorVisual = valorBruto ?? 0;
            const valorInput  = valorBruto ?? "";


            // Verifica se está no modo edição de notas
            // MODO DE VISUALIZAÇÃO (nenhum modo de edição ativo)
            if (!modoEdicaoCompleta && !modoEdicaoPorComponente) {
                return `<td>${valorVisual}</td>`;
            }

            // MODO EDIÇÃO COMPLETA
            if (modoEdicaoCompleta) {
                return `
            <td>
            <input 
                type="number" 
                class="input-nota" 
                id="${ra},${c.ID_COMPONENTE}" 
                value="${valorInput}" />
            </td>
            `;
            }

            // MODO EDIÇÃO POR COMPONENTE
            if (modoEdicaoPorComponente) {
                if (c.ID_COMPONENTE == componenteEmEdicao) {
                    return `
                <td>
                <input 
                    type="number" 
                    class="input-nota" 
                    id="${ra},${c.ID_COMPONENTE}"
                    value="${valorInput}">
                </td>
                `;
                } else {
                    return `<td>${valorVisual}</td>`;
                }
            }
        }).join("");

        // Média final - só visualização, pois é calculada a partir da fórmula da disciplina
        html += `<td>${calcularMedia(dados)}</td>`;

        linha.innerHTML = html;
        tbody.appendChild(linha);
    }
    document.getElementById("btn-exportar").style.display="flex";
    document.getElementById("btn-editar-notas").style.display = "flex";
    document.getElementById("btn-editar-por-componente").style.display = "flex";
    preencherSelectComponentes();
    modoEdicaoCompleta = false;
    modoEdicaoPorComponente = false;
}

// Limpa a tabela das notas dos alunos
function limparTabelaNotasAlunos() {
    const tabela = document.getElementById("tabela-notas");
    const thead = tabela.querySelector("thead");
    const tbody = tabela.querySelector("tbody");

    thead.innerHTML = ``;
    tbody.innerHTML = ``;
}

// Adiciona uma nota ao banco de dados
async function adicionarNota(valor, id_componente, ra_aluno){
    try {
        const response = await fetch(`${API_URL}/notas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({
                valor,
                id_componente: Number(id_componente),
                ra_aluno,
            }),
        });

        if (!response.ok) throw new Error("Erro ao adicionar nota");
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao adicionar nota: " + error.message);
    }
}

// Edita uma nota do banco de dados
async function editarNota(id, valor) {
    try {
        const response = await fetch(`${API_URL}/notas/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                valor
            }),
        });

        if (!response.ok) throw new Error("Erro ao atualizar nota");
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao atualizar aluno: " + error.message);
    }
}

// Carrega a formula do banco de dados a partir da disciplina
async function carregarFormula() {
    try {
        const response = await fetch(`${API_URL}/formula/${idDisciplinaAtiva}`)
        if (!response.ok) throw new Error("Erro ao carregar formulas");
        try {
            formulaData = await response.json();
        }catch {
            formulaData = null;
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}

// Calcula a Média a partir da formula
function calcularMedia(dados){
    if (!formulaData) return "";

    let expressao = formulaData.FORMULA;

    // Substitui todas as variáveis pela nota
    componentesNotasData.forEach(comp => {
        const nomeVariavel = `$${comp.SIGLA}`;
        expressao = expressao.replaceAll(nomeVariavel, dados.notas[comp.ID_COMPONENTE]);
    });
    
    try {
        // Cria função que retorna o valor da expressão
        const fn = new Function(`return (${expressao});`);
        const media = fn();
        return media.toFixed(2);

    } catch (error) {
        console.error(error);
        return "Fórmula invalida";
    }
}

// Função para exportar a tabela que está visivel
function exportarTabelaVisivelCSV() {
    const tabela = document.getElementById("tabela-notas");
    if (!tabela) {
        alert("Tabela de notas não encontrada.");
        return;
    }

    const thead = tabela.querySelector("thead");
    const tbody = tabela.querySelector("tbody");

    const linhasCSV = [];

    const ths = Array.from(thead.querySelectorAll("th"));
    const header = ths.map(th => th.textContent.trim());
    linhasCSV.push(header.join(";"));

    const trs = Array.from(tbody.querySelectorAll("tr"));

    trs.forEach(tr => {
        const tds = Array.from(tr.querySelectorAll("td"));
        if (tds.length === 0) return;

        const linha = tds.map(td => {
            let valor = td.textContent.trim();
            if (valor.length === 0) {
                alert("Tabela incompleta, por favor insira todas as notas")
            }
            return valor;
        });

        linhasCSV.push(linha.join(";"));
    });

    if (linhasCSV.length <= 1) {
        alert("Não há dados para exportar.");
        return;
    }

    const csvContent = linhasCSV.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `notas_turma_${idTurmaAtiva}.csv`;
    document.body.append(a)
    a.click();
    a.remove()
    URL.revokeObjectURL(url);
}

// Preenche o select dos componetes para o modo de edição por componente
function preencherSelectComponentes() {
    const select = document.getElementById("select-componente");
    select.innerHTML = `<option value="">Selecione um componente</option>`;

    componentesNotasData.forEach(c => {
        const op = document.createElement("option");
        op.value = c.ID_COMPONENTE;
        op.textContent = c.NOME;
        select.appendChild(op);
    });
}

// Se tiver mudança no select instituicao
const selectsInstituicao = document.getElementsByClassName("sortInstituicao");
for (const select of selectsInstituicao) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idInstituicaoAtiva = e.target.value;
        await carregarCursos();
        limparTabelaNotasAlunos()
        document.getElementById("btn-exportar").style.display="none";
        document.getElementById("btn-editar-notas").style.display="none";
        document.getElementById("btn-editar-por-componente").style.display = "none";
    });
}

// Se tiver mudança no select Curso
const selectsCurso = document.getElementsByClassName("sortCurso");
for (const select of selectsCurso) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idCursoAtivo = e.target.value;
        await carregarDisciplinas();
        limparTabelaNotasAlunos()
        document.getElementById("btn-exportar").style.display="none";
        document.getElementById("btn-editar-notas").style.display="none";
        document.getElementById("btn-editar-por-componente").style.display = "none";
    });
}

// Se tiver mudança no select Disciplina
const selectsDisciplina = document.getElementsByClassName("sortDisciplina");
for (const select of selectsDisciplina) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idDisciplinaAtiva = e.target.value;
        await carregarTurmas();
        await carregarFormula();
        limparTabelaNotasAlunos()
        document.getElementById("btn-exportar").style.display="none";
        document.getElementById("btn-editar-notas").style.display="none";
        document.getElementById("btn-editar-por-componente").style.display = "none";
    });
}

// Se tiver mudança no select Turma
const selectsTurma = document.getElementsByClassName("sortTurma");
for (const select of selectsTurma) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idTurmaAtiva = e.target.value;
        await carregarTabelaAlunosNotas()
    });
}

// Click no botão de editar notas
document.getElementById("btn-editar-notas").addEventListener("click", ()=> {
    modoEdicaoCompleta = true;
    modoEdicaoPorComponente = false;
    renderizarNotasAlunos();
    document.getElementById("btn-editar-notas").style.display="none";
    document.getElementById("btn-editar-por-componente").style.display = "none";
    document.getElementById("btn-exportar").style.display="none";
    document.getElementById("btn-salvar").style.display="flex";
})

// Click no botão de salvar alterações
document.getElementById("btn-salvar").addEventListener("click", async(e) => {
    e.preventDefault();
    const notasInputs = document.querySelectorAll(".input-nota")
    if (!notasInputs || notasInputs.length === 0) {
        alert("Nada para salvar")
    }
    for (const input of notasInputs) {
        const [ra, id_componente] = input.id.split(",");
        const valorBruto = input.value;
        const valorInput = Number(valorBruto);
        
        const notaExistente = notasAlunosData.find(n =>
            n.RA_ALUNO == ra && n.ID_COMPONENTE == id_componente
        );
        
        const valorAntigo = notaExistente && notaExistente.VALOR != null ? Number(notaExistente.VALOR) : "";
        
        // Se não mudou nada, pula
        if (valorInput === valorAntigo) {
            continue;
        }
        
        if (valorBruto === "" || Number.isNaN(valorInput)) {
            continue;
        }
        
        if (valorInput > 10 || valorInput < 0) {
            alert(`${valorInput}: É um valor inválido para uma nota`);
            continue;
        }
        
        if (notaExistente && notaExistente.ID_NOTA) {
            await editarNota(notaExistente.ID_NOTA, valorInput);
        } else {
            await adicionarNota(valorInput, id_componente, ra);
        }
    }
    modoEdicaoNotas = false;
    await carregarTabelaAlunosNotas();
    document.getElementById("btn-salvar").style.display="none";
    document.getElementById("select-componente").style.display = "none";
    document.getElementById("btn-editar-notas").style.display="flex";
    document.getElementById("btn-editar-por-componente").style.display = "flex";
    document.getElementById("btn-exportar").style.display="flex";
})

// Click no botão de editar por componente
document.getElementById("btn-editar-por-componente").addEventListener("click", () => {
    modoEdicaoCompleta = false;
    modoEdicaoPorComponente = true;
    document.getElementById("btn-editar-notas").style.display="none";
    document.getElementById("btn-editar-por-componente").style.display = "none";
    document.getElementById("btn-exportar").style.display="none";
    document.getElementById("select-componente").style.display = "flex";
    document.getElementById("btn-salvar").style.display = "flex";
});

// Mudança no select do componente para edição
document.getElementById("select-componente").addEventListener("change", () => {
    componenteEmEdicao = Number(document.getElementById("select-componente").value);
    
    if (componenteEmEdicao) {
        renderizarNotasAlunos();
        document.getElementById("btn-editar-notas").style.display="none";
        document.getElementById("btn-editar-por-componente").style.display = "none";
        document.getElementById("btn-exportar").style.display="none";
        document.getElementById("select-componente").style.display = "none";
        document.getElementById("btn-salvar").style.display = "flex";
    }
});

// Abrir modal de exportação
document.querySelector('.btn-exportar').addEventListener('click', function() {
    abrirModal('modalExportar');
});

function abrirModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function fecharModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Confirmar a exportação
// Podia ser feita direto no btn-exportar
document.getElementById('btn-confirmar').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (!idTurmaAtiva) {
        alert('Por favor, selecione uma turma antes de exportar.');
        return;
    }
    exportarTabelaVisivelCSV();
    alert(`Exportando notas da turma em CSV...`);
    fecharModal('modalExportar');
});

// Inicialização
carregarInstituicoes();