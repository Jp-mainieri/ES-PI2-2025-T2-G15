const API_URL = "http://localhost:3000";

const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado"));
const idProfessor = usuarioLogado.id_professor;
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

async function carregarTabelaAlunosNotas() {
    try {
        const notas = await fetch(`${API_URL}/notas/turma/${idTurmaAtiva}`)
        const componentes = await fetch(`${API_URL}/componente-nota/disciplina/${idDisciplinaAtiva}`)

        if (!notas.ok || !componentes.ok) throw new Error("Erro ao carregar notas ou componentes");
        notasAlunosData = await notas.json();
        componentesNotasData = await componentes.json();
        console.log(notasAlunosData)
        console.log(componentesNotasData)
        renderizarNotasAlunos();
    }catch (error) {
        console.error("Erro:", error);
    }
}

function renderizarNotasAlunos() {
    const tabela = document.getElementById("tabela-notas");
    if (!tabela) return; // evita erro se o elemento não existir
    const thead = tabela.querySelector("#tabela-notas thead");
    const tbody = tabela.querySelector("#tabela-notas tbody");

    if (!notasAlunosData || notasAlunosData.length === 0) {
        tbody.innerHTML = `
      <td>Nenhum aluno para a turma ou componente de nota para a disciplina encontrado</td>
      `;
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

    const alunosMap = {};
    for (const n of notasAlunosData) {
        if (!alunosMap[n.RA_ALUNO]) {
            alunosMap[n.RA_ALUNO] = { nome: n.NOME, notas: {} };
        }
        alunosMap[n.RA_ALUNO].notas[n.ID_COMPONENTE] = n.VALOR;
    }

    // Montar o corpo da tabla
    for (const [ra, dados] of Object.entries(alunosMap)) {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${ra}</td>
            <td>${dados.nome}</td>
            ${componentesNotasData.map(c => `<td><input type="number" class="input-nota" id="${ra},${c.ID_COMPONENTE}" value="${dados.notas[c.ID_COMPONENTE]}" /></td>`).join('')}
            <td>${calcularMedia(dados)}</td>
        `;
        tbody.appendChild(linha);
    }
}

function limparTabelaNotasAlunos() {
    const tabela = document.getElementById("tabela-notas");
    const thead = tabela.querySelector("#tabela-notas thead");
    const tbody = tabela.querySelector("#tabela-notas tbody");

    thead.innerHTML = ``;
    tbody.innerHTML = ``;
}

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
        return media;

    } catch (error) {
        console.error(error);
        alert("A fórmula é matematicamente inválida (parênteses ou operadores incorretos).");
        return "";
    }
}

carregarInstituicoes();
limparTabelaNotasAlunos()

const selectsInstituicao = document.getElementsByClassName("sortInstituicao");
for (const select of selectsInstituicao) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idInstituicaoAtiva = e.target.value;
        await carregarCursos();
        await limparTabelaNotasAlunos()
    });
}
const selectsCurso = document.getElementsByClassName("sortCurso");
for (const select of selectsCurso) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idCursoAtivo = e.target.value;
        await carregarDisciplinas();
        await limparTabelaNotasAlunos()
    });
}
const selectsDisciplina = document.getElementsByClassName("sortDisciplina");
for (const select of selectsDisciplina) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idDisciplinaAtiva = e.target.value;
        await carregarTurmas();
        await carregarFormula();
        await limparTabelaNotasAlunos()
    });
}
const selectsTurma = document.getElementsByClassName("sortTurma");
for (const select of selectsTurma) {
    select.addEventListener("change", async (e) => {
        e.preventDefault();
        idTurmaAtiva = e.target.value;
        await limparTabelaNotasAlunos()
        await carregarTabelaAlunosNotas()
    });
}

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

         const valorAntigo = notaExistente && notaExistente.VALOR != null ? Number(notaExistente.VALOR) : 0;

        // Se não mudou nada, pula
        if (valorInput === valorAntigo) {
            continue;
        }

        if (valorBruto === "" || Number.isNaN(valorInput)) {
            continue;
        }

        if (notaExistente && notaExistente.ID_NOTA) {
            await editarNota(notaExistente.ID_NOTA, valorInput);
        } else {
            await adicionarNota(valorInput, id_componente, ra);
        }
    }
    limparTabelaNotasAlunos();
    await carregarTabelaAlunosNotas();
})

// === Abrir modal ===
document.querySelector('.btn-exportar').addEventListener('click', function() {
  abrirModal('modalExportar');
});

function abrirModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function fecharModal(id) {
  document.getElementById(id).style.display = 'none';
}

// === Envio do formulário ===
document.getElementById('formExportarNotas').addEventListener('submit', function(e) {
  e.preventDefault();

  const instituicao = document.getElementById('instituicaoExportar').value;
  const curso = document.getElementById('cursoExportar').value;
  const turma = document.getElementById('turmaExportar').value;
  const formato = document.querySelector('input[name="formato"]:checked').value;

  if (!instituicao || !curso || !turma) {
    alert('Por favor, preencha todos os campos antes de exportar.');
    return;
  }

  alert(`Exportando notas da turma ${turma} (${formato.toUpperCase()})...`);
  fecharModal('modalExportar');
  this.reset();
});
