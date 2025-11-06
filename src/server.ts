import express, {Request, Response} from "express";
import bodyParser from "body-parser"

// Imports de funções do CRUD

import {
    getAllInstituicoes,
    getAllInstituicoesByProfessor,
    addInstituicao,
    getInstituicaoById,
    updateInstituicao,
    deleteInstituicao
} from "./db/instituicoes";

import {
    getAllCursos,
    getAllCursosByInstituicao,
    getCursoById,
    addCurso,
    updateCurso,
    deleteCurso
} from "./db/cursos";

import {
    getAllProfessores,
    getProfessorById,
    addProfessor,
    updateProfessor,
    deleteProfessor
} from "./db/professores";

import {
    getAllDisciplinas,
    getAllDisciplinasByCurso,
    getDisciplinaById,
    addDisciplina,
    updateDisciplina,
    deleteDisciplina
} from "./db/disciplinas";

import {
    getAllTurmas,
    getAllTurmasByCurso,
    getTurmaById,
    addTurma,
    updateTurma,
    deleteTurma
} from "./db/turmas";

import {
    getAllAlunos,
    getAlunoByRA,
    addAluno,
    updateAluno,
    deleteAluno
} from "./db/alunos";

import {
    getAllNotas,
    getNotaById,
    addNota,
    updateNota,
    deleteNota
} from "./db/notas";

const app = express();
const port = 3000;

app.use(bodyParser.json());

// ROTAS:

// Rotas de Instituições:

// Rota para listar todas as instituições
app.get("/instituicoes", async (req:Request,res:Response) => {
    try {
        const instituicoes = await getAllInstituicoes();
        res.json(instituicoes);
    }catch (err) {
        console.error(err);
        res.status(500).json({
            Error:"Erro ao buscar instituições"
        })
    }
})

// Rota para obter uma instituição por id
app.get('/instituicoes/:id', async(req:Request,res:Response)=>{
    try{
        const id = Number(req.params.id);
        const instituicao = await getInstituicaoById(id);
        if (instituicao) {
            res.json(instituicao);
        }else {
            res.status(404).json({
                message: "Instituição nao foi encontrado com o id fornecido."
            })
        }
    }catch (err) {
        console.error(err)
        res.status(500).json({
            error: "Erro ao buscar instituição pelo ID fornecido."
        })
    }
})

//Obter Instituições Por Professor
app.get('/instituicoes/:id_professor', async(req:Request,res:Response)=>{
    try{
        const id_professor = Number(req.params.id);
        const instituicao = await getAllInstituicoesByProfessor(id_professor);
        if (instituicao) {
            res.json(instituicao);
        }else {
            res.status(404).json({
                message: "Nenhuma instituição foi cadastrada para esse professor."
            })
        }
    }catch (err) {
        console.error(err)
        res.status(500).json({
            error: "Erro ao buscar instituições pelo id do professor."
        })
    }
})

// Rota para adicionar uma instituição
app.post("/instituicoes/:id_professor", async (req:Request,res:Response) => {
    try {
        const id_professor = Number(req.params.id_professor);
        const {nome} = req.body;

        if (!nome) {
            return res.status(400).json({
                erro: "Campo Nome é Obrigatórios."
            })
        }
        const id = await addInstituicao(nome, id_professor);
        res.status(200).json({
            message: "Instituição inserida com sucesso.", id
        })

    }catch (err) {
        console.error(err);
        res.status(500).json({
            error:"Erro ao inserir instituição."
        })
    }
})

// Rota para editar uma instituição
app.post("/instituicoes/editar/:id", async (req:Request,res:Response)=>{
    try{
        const {nome} = req.body;
        const id = Number(req.params.id);
        if (!nome) {
            return res.status(400).json({
                erro: "Campo Nome é Obrigatório"
            });
        }
        await updateInstituicao(id,nome);
        res.status(200).json({
            message: "Instituição alterada com sucesso.", id
        })
    }catch (err) {
        console.error(err);

    }
})

// Rota para excluir uma instituição
app.post("/instituicoes/excluir/:id", async (req:Request,res:Response)=>{
    try{
        const id = Number(req.params.id);
        await deleteInstituicao(id);
        res.status(200).json({
            message: "Instituição exluida com sucesso.", id
        })
    }catch (err) {
        console.error(err);
    }
})

// Rotas de Cursos:

// Rota para obter todos os cursos
app.get('/cursos', async (req:Request, res:Response) => {
    try {
        const cursos = await getAllCursos();
        res.json(cursos);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar cursos"
        });
    }
});

// Rota para obter um curso por id
app.get('/cursos/:id', async (req:Request, res:Response) => {
    try {
        const id = Number(req.params.id);
        const curso = await getCursoById(id);
        if (curso) {
            res.json(curso);
        } else {
            res.status(404).json({
                message: "Curso não foi encontrado com o id fornecido."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar curso pelo ID fornecido."
        });
    }
});

// Rota para inserir um curso
app.post('/cursos', async (req:Request, res:Response) => {
    try {
        const {nome, sigla} = req.body;
        if (!nome || !sigla) {
            return res.status(400).json({
                error: "Campos Nome e Sigla são Obrigatórios."
            });
        }
        const id = await addCurso(nome, sigla);
        res.status(200).json({
            message: "Curso adicionado com sucesso.", id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir curso."
        });
    }
});

// Rota para editar um curso
app.post('/cursos/editar/:id', async (req:Request, res:Response) => {
    try {
        const {nome, sigla, codigo} = req.body;
        const id = Number(req.params.id);
        if (!nome || !sigla) {
            return res.status(400).json({
                error: "Campos Nome e Sigla são Obrigatórios."
            });
        }
        const updated = await updateCurso(id, nome, codigo);
        if (updated) {
            res.status(200).json({
                message: "Curso atualizado com sucesso.", id
            });
        } else {
            res.status(404).json({
                message: "Curso não encontrado."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar curso."
        });
    }
});

// Rota para excluir um curso
app.post('/cursos/excluir/:id', async (req:Request, res:Response) => {
    try {
        const id = Number(req.params.id);
        const deleted = await deleteCurso(id);
        if (deleted) {
            res.status(200).json({
                message: "Curso excluído com sucesso.", id
            });
        } else {
            res.status(404).json({
                message: "Curso não encontrado."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao excluir curso."
        });
    }
});

// Rotas de Professores:

app.get('/professores', async (req:Request, res:Response) => {
    try {
        const professores = await getAllProfessores();
        res.json(professores);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar professores"
        });
    }
});

app.get('/professores/:id', async (req:Request, res:Response) => {
    try {
        const id = Number(req.params.id);
        const professor = await getProfessorById(id);
        if (professor) {
            res.json(professor);
        } else {
            res.status(404).json({
                message: "Professor não foi encontrado com o id fornecido."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar professor pelo ID fornecido."
        });
    }
});

app.post('/professores', async (req:Request, res:Response) => {
    try {
        const {nome, telefone, senha, diciplina, email} = req.body;
        if (!nome || !telefone || !senha || !diciplina || !email) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios."
            });
        }
        const id = await addProfessor(nome, telefone, senha, diciplina, email);
        res.status(200).json({
            message: "Professor adicionado com sucesso.", id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir professor."
        });
    }
});

app.post('/professores/editar/:id', async (req:Request, res:Response) => {
    try {
        const {nome, telefone, senha, diciplina, email} = req.body;
        const id = Number(req.params.id);
        if (!nome || !telefone || !senha || !diciplina || !email) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios."
            });
        }
        const updated = await updateProfessor(id, nome, telefone, senha, diciplina, email);
        if (updated) {
            res.status(200).json({
                message: "Professor atualizado com sucesso.", id
            });
        } else {
            res.status(404).json({
                message: "Professor não encontrado."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar professor."
        });
    }
});

app.post('/professores/excluir/:id', async (req:Request, res:Response) => {
    try {
        const id = Number(req.params.id);
        const deleted = await deleteProfessor(id);
        if (deleted) {
            res.status(200).json({
                message: "Professor excluído com sucesso.", id
            });
        } else {
            res.status(404).json({
                message: "Professor não encontrado."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao excluir professor."
        });
    }
});

// Rotas de Disciplinas:

app.get('/disciplinas', async (req:Request, res:Response) => {
    try {
        const disciplinas = await getAllDisciplinas();
        res.json(disciplinas);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar disciplinas"
        });
    }
});

app.get('/disciplinas/:id', async (req:Request, res:Response) => {
    try {
        const id = Number(req.params.id);
        const disciplina = await getDisciplinaById(id);
        if (disciplina) {
            res.json(disciplina);
        } else {
            res.status(404).json({
                message: "Disciplina não foi encontrada com o id fornecido."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar disciplina pelo ID fornecido."
        });
    }
});

app.post('/disciplinas', async (req:Request, res:Response) => {
    try {
        const {nome, sigla, codigo, periodo,id_curso} = req.body;
        if (!nome || !sigla || !codigo || !periodo) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios."
            });
        }
        const id = await addDisciplina(nome, sigla, codigo, periodo, id_curso);
        res.status(200).json({
            message: "Disciplina adicionada com sucesso.", id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir disciplina."
        });
    }
});

app.post('/disciplinas/editar/:id', async (req:Request, res:Response) => {
    try {
        const {nome, sigla, codigo, periodo} = req.body;
        const id = Number(req.params.id);
        if (!nome || !sigla || !codigo || !periodo) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios."
            });
        }
        const updated = await updateDisciplina(id, nome, sigla, codigo, periodo);
        if (updated) {
            res.status(200).json({
                message: "Disciplina atualizada com sucesso.", id
            });
        } else {
            res.status(404).json({
                message: "Disciplina não encontrada."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar disciplina."
        });
    }
});

app.post('/disciplinas/excluir/:id', async (req:Request, res:Response) => {
    try {
        const id = Number(req.params.id);
        const deleted = await deleteDisciplina(id);
        if (deleted) {
            res.status(200).json({
                message: "Disciplina excluída com sucesso.", id
            });
        } else {
            res.status(404).json({
                message: "Disciplina não encontrada."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao excluir disciplina."
        });
    }
});

// Rotas de Turmas:

app.get('/turmas', async (req:Request, res:Response) => {
    try {
        const turmas = await getAllTurmas();
        res.json(turmas);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar turmas"
        });
    }
});

app.get('/turmas/:id', async (req:Request, res:Response) => {
    try {
        const id = Number(req.params.id);
        const turma = await getTurmaById(id);
        if (turma) {
            res.json(turma);
        } else {
            res.status(404).json({
                message: "Turma não foi encontrada com o id fornecido."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar turma pelo ID fornecido."
        });
    }
});

app.post('/turmas', async (req:Request, res:Response) => {
    try {
        const {nome, codigo, turno, id_disciplina} = req.body;
        if (!nome || !codigo || !turno || !id_disciplina) {
            return res.status(400).json({
                error: "Campos Nome e Sigla são obrigatórios."
            });
        }
        const id = await addTurma(nome, codigo, turno, id_disciplina);
        res.status(200).json({
            message: "Turma adicionada com sucesso.", id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir turma."
        });
    }
});

app.post('/turmas/editar/:id', async (req:Request, res:Response) => {
    try {
        const {nome, codigo,turno} = req.body;
        const id = Number(req.params.id);
        if (!nome || !codigo || !turno) {
            return res.status(400).json({
                error: "Campos Nome e Sigla são obrigatórios."
            });
        }
        const updated = await updateTurma(id, nome, codigo, turno );
        if (updated) {
            res.status(200).json({
                message: "Turma atualizada com sucesso.", id
            });
        } else {
            res.status(404).json({
                message: "Turma não encontrada."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar turma."
        });
    }
});

app.post('/turmas/excluir/:id', async (req:Request, res:Response) => {
    try {
        const id = Number(req.params.id);
        const deleted = await deleteTurma(id);
        if (deleted) {
            res.status(200).json({
                message: "Turma excluída com sucesso.", id
            });
        } else {
            res.status(404).json({
                message: "Turma não encontrada."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao excluir turma."
        });
    }
});

// Rotas de Alunos:

app.get('/alunos', async (req:Request, res:Response) => {
    try {
        const alunos = await getAllAlunos();
        res.json(alunos);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar alunos"
        });
    }
});

app.get('/alunos/:ra', async (req:Request, res:Response) => {
    try {
        const ra = req.params.ra;
        const aluno = await getAlunoByRA(ra);
        if (aluno) {
            res.json(aluno);
        } else {
            res.status(404).json({
                message: "Aluno não foi encontrado com o RA fornecido."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar aluno pelo RA fornecido."
        });
    }
});

app.post('/alunos', async (req:Request, res:Response) => {
    try {
        const {ra_aluno, nome, matricula, curso, data_nascimento} = req.body;
        if (!ra_aluno || !nome || !matricula || !curso || !data_nascimento) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios."
            });
        }
        const ra = await addAluno(ra_aluno, nome, matricula, curso, new Date(data_nascimento));
        res.status(200).json({
            message: "Aluno adicionado com sucesso.", ra
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir aluno."
        });
    }
});

app.post('/alunos/editar/:ra', async (req:Request, res:Response) => {
    try {
        const {nome, matricula, curso, data_nascimento} = req.body;
        const ra_aluno = req.params.ra;
        if (!nome || !matricula || !curso || !data_nascimento) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios."
            });
        }
        const updated = await updateAluno(ra_aluno, nome, matricula, curso, new Date(data_nascimento));
        if (updated) {
            res.status(200).json({
                message: "Aluno atualizado com sucesso.", ra_aluno
            });
        } else {
            res.status(404).json({
                message: "Aluno não encontrado."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar aluno."
        });
    }
});

app.post('/alunos/excluir/:ra', async (req:Request, res:Response) => {
    try {
        const ra = req.params.ra;
        const deleted = await deleteAluno(ra);
        if (deleted) {
            res.status(200).json({
                message: "Aluno excluído com sucesso.", ra
            });
        } else {
            res.status(404).json({
                message: "Aluno não encontrado."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao excluir aluno."
        });
    }
});

// Rotas de Notas:

app.get('/notas', async (req:Request, res:Response) => {
    try {
        const notas = await getAllNotas();
        res.json(notas);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar notas"
        });
    }
});

app.get('/notas/:id', async (req:Request, res:Response) => {
    try {
        const id = Number(req.params.id);
        const nota = await getNotaById(id);
        if (nota) {
            res.json(nota);
        } else {
            res.status(404).json({
                message: "Nota não foi encontrada com o id fornecido."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar nota pelo ID fornecido."
        });
    }
});

app.post('/notas', async (req:Request, res:Response) => {
    try {
        const {valor} = req.body;
        if (valor === undefined || valor === null) {
            return res.status(400).json({
                error: "Campo valor é obrigatório."
            });
        }
        const id = await addNota(Number(valor));
        res.status(200).json({
            message: "Nota adicionada com sucesso.", id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir nota."
        });
    }
});

app.post('/notas/editar/:id', async (req:Request, res:Response) => {
    try {
        const {valor} = req.body;
        const id = Number(req.params.id);
        if (valor === undefined || valor === null) {
            return res.status(400).json({
                error: "Campo valor é obrigatório."
            });
        }
        const updated = await updateNota(id, Number(valor));
        if (updated) {
            res.status(200).json({
                message: "Nota atualizada com sucesso.", id
            });
        } else {
            res.status(404).json({
                message: "Nota não encontrada."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar nota."
        });
    }
});

app.post('/notas/excluir/:id', async (req:Request, res:Response) => {
    try {
        const id = Number(req.params.id);
        const deleted = await deleteNota(id);
        if (deleted) {
            res.status(200).json({
                message: "Nota excluída com sucesso.", id
            });
        } else {
            res.status(404).json({
                message: "Nota não encontrada."
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao excluir nota."
        });
    }
});


app.listen(port, ()=>{
    console.log(`Servidor rodando: http://localhost:${port}`)
})