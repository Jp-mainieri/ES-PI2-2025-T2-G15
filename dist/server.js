"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Feito por João Pedro Panza Mainieri - 25006642
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const recuperacaoSenha_1 = require("./db/recuperacaoSenha");
// Imports de funções do CRUD
const instituicoes_1 = require("./db/instituicoes");
const cursos_1 = require("./db/cursos");
const professores_1 = require("./db/professores");
const disciplinas_1 = require("./db/disciplinas");
const turmas_1 = require("./db/turmas");
const alunos_1 = require("./db/alunos");
const notas_1 = require("./db/notas");
// Express.js
const app = (0, express_1.default)();
const port = 3000;
// Cors e body parser para o Express
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const path_1 = __importDefault(require("path"));
// Servir os arquivos HTML, CSS e JS da pasta "src" ou "public"
app.use(express_1.default.static(path_1.default.join(__dirname, "../")));
// ROTAS:
// Rotas de Instituições:
// Rota para listar todas as instituições por professor
app.get("/instituicoes/professor/:id_professor", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_professor = Number(req.params.id_professor);
        const instituicoes = yield (0, instituicoes_1.getAllInstituicoesByProfessor)(id_professor);
        res.json(instituicoes);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar instituições pelo id do professor.",
        });
    }
}));
// Rota para obter uma instituição por id
app.get("/instituicoes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const instituicao = yield (0, instituicoes_1.getInstituicaoById)(id);
        if (instituicao) {
            res.json(instituicao);
        }
        else {
            res.status(404).json({
                message: "Instituição nao foi encontrado com o id fornecido.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar instituição pelo ID fornecido.",
        });
    }
}));
// Rota para adicionar uma instituicão
app.post("/instituicoes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, id_professor } = req.body;
        if (!nome || id_professor === undefined) {
            return res.status(400).json({
                error: "Campos Nome e ID do Professor são obrigatórios.",
            });
        }
        const id = yield (0, instituicoes_1.addInstituicao)(nome, Number(id_professor));
        res.status(201).json({
            message: "Instituição inserida com sucesso.",
            id,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir instituição.",
        });
    }
}));
// Rota para editar uma instituicão
app.put("/instituicoes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome } = req.body;
        const id = Number(req.params.id);
        if (!nome) {
            return res.status(400).json({
                error: "Campo Nome é obrigatório",
            });
        }
        const updated = yield (0, instituicoes_1.updateInstituicao)(id, nome);
        if (updated) {
            res.status(200).json({
                message: "Instituição alterada com sucesso.",
                id,
            });
        }
        else {
            res.status(404).json({
                message: "Instituição não encontrada.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar instituição.",
        });
    }
}));
// Rota para deletar uma instituicão
app.delete("/instituicoes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const deleted = yield (0, instituicoes_1.deleteInstituicao)(id);
        if (deleted) {
            res.status(200).json({
                message: "Instituição excluída com sucesso.",
                id,
            });
        }
        else {
            res.status(404).json({
                message: "Instituição não encontrada.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao excluir instituição.",
        });
    }
}));
// Rotas de Cursos:
// Rota para obter cursos por instituição
app.get("/cursos/instituicao/:id_instituicao", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_instituicao = Number(req.params.id_instituicao);
        const cursos = yield (0, cursos_1.getAllCursosByInstituicao)(id_instituicao);
        res.json(cursos);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar cursos por instituição",
        });
    }
}));
// Rota para obter um curso por id
app.get("/cursos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const curso = yield (0, cursos_1.getCursoById)(id);
        if (curso) {
            res.json(curso);
        }
        else {
            res.status(404).json({
                message: "Curso não foi encontrado com o id fornecido.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar curso pelo ID fornecido.",
        });
    }
}));
// Rota para inserir um curso
app.post("/cursos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, codigo, id_instituicao } = req.body;
        if (!nome || !codigo) {
            return res.status(400).json({
                error: "Campos Nome e Código são Obrigatórios.",
            });
        }
        const id = yield (0, cursos_1.addCurso)(nome, codigo, id_instituicao);
        res.status(201).json({
            message: "Curso adicionado com sucesso.",
            id,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir curso.",
        });
    }
}));
// Rota para editar um curso
app.put("/cursos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, codigo } = req.body;
        const id = Number(req.params.id);
        if (!nome || !codigo) {
            return res.status(400).json({
                error: "Campos Nome e Código são Obrigatórios.",
            });
        }
        const updated = yield (0, cursos_1.updateCurso)(id, nome, codigo);
        if (updated) {
            res.status(200).json({
                message: "Curso atualizado com sucesso.",
                id,
            });
        }
        else {
            res.status(404).json({
                message: "Curso não encontrado.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar curso.",
        });
    }
}));
// Rota para excluir um curso
app.delete("/cursos/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const deleted = yield (0, cursos_1.deleteCurso)(id);
        if (deleted) {
            res.status(200).json({
                message: "Curso excluído com sucesso.",
                id,
            });
        }
        else {
            res.status(404).json({
                message: "Curso não encontrado.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao excluir curso.",
        });
    }
}));
// Rotas de Professores:
// Rota para obter todos os professores
app.get('/professores', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const professores = yield (0, professores_1.getAllProfessores)();
        res.json(professores);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar professores"
        });
    }
}));
// Rota para obter um professor pelo ID
app.get('/professores/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const professor = yield (0, professores_1.getProfessorById)(id);
        if (professor) {
            res.json(professor);
        }
        else {
            res.status(404).json({
                message: "Professor não foi encontrado com o id fornecido."
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar professor pelo ID fornecido."
        });
    }
}));
// Rota para inserir um professor
app.post('/professores', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, telefone, senha, email } = req.body;
        if (!nome || !telefone || !senha || !email) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios."
            });
        }
        const id = yield (0, professores_1.addProfessor)(nome, telefone, senha, email);
        res.status(201).json({
            message: "Professor adicionado com sucesso.", id
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir professor."
        });
    }
}));
// Rota para editar um professor
app.put('/professores/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, telefone, senha, email } = req.body;
        const id = Number(req.params.id);
        if (!nome || !telefone || !senha || !email) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios."
            });
        }
        const updated = yield (0, professores_1.updateProfessor)(id, nome, telefone, senha, email);
        if (updated) {
            res.status(200).json({
                message: "Professor atualizado com sucesso.", id
            });
        }
        else {
            res.status(404).json({
                message: "Professor não encontrado."
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar professor."
        });
    }
}));
// Rota de login
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ error: "Email e senha são obrigatórios." });
        }
        // Pega todos os professores e busca pelo email e senha
        const professores = yield (0, professores_1.getAllProfessores)();
        const professor = professores.find(p => p.email === email && p.senha === senha);
        if (!professor) {
            return res.status(401).json({ error: "Email ou senha incorretos." });
        }
        // Retorna os dados do professor sem a senha
        const { senha: _ } = professor, professorSemSenha = __rest(professor, ["senha"]);
        res.status(200).json(professorSemSenha);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no servidor ao tentar logar." });
    }
}));
// Rotas de Disciplinas:
// Rota para buscar uma disciplina pelo id
app.get("/disciplinas/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const disciplina = yield (0, disciplinas_1.getDisciplinaById)(id);
        if (disciplina) {
            res.json(disciplina);
        }
        else {
            res.status(404).json({
                message: "Disciplina não foi encontrada com o id fornecido.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar disciplina pelo ID fornecido.",
        });
    }
}));
// Rota para obter disciplinas por curso
app.get("/disciplinas/curso/:id_curso", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_curso = Number(req.params.id_curso);
        const disciplinas = yield (0, disciplinas_1.getAllDisciplinasByCurso)(id_curso);
        res.json(disciplinas);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar disciplinas por curso",
        });
    }
}));
// Rota para inserir uma disciplina
app.post("/disciplinas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, sigla, codigo, periodo, id_curso } = req.body;
        if (!nome || !sigla || !codigo || !periodo || id_curso === undefined) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios.",
            });
        }
        const id = yield (0, disciplinas_1.addDisciplina)(nome, sigla, codigo, Number(periodo), Number(id_curso));
        res.status(201).json({
            message: "Disciplina adicionada com sucesso.",
            id,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir disciplina.",
        });
    }
}));
// Rota para editar uma disciplina
app.put("/disciplinas/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, sigla, codigo, periodo } = req.body;
        const id = Number(req.params.id);
        if (!nome || !sigla || !codigo || !periodo) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios.",
            });
        }
        const updated = yield (0, disciplinas_1.updateDisciplina)(id, nome, sigla, codigo, Number(periodo));
        if (updated) {
            res.status(200).json({
                message: "Disciplina atualizada com sucesso.",
                id,
            });
        }
        else {
            res.status(404).json({
                message: "Disciplina não encontrada.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar disciplina.",
        });
    }
}));
// Rota para excluir uma disciplina
app.delete("/disciplinas/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const deleted = yield (0, disciplinas_1.deleteDisciplina)(id);
        if (deleted) {
            res.status(200).json({
                message: "Disciplina excluída com sucesso.",
                id,
            });
        }
        else {
            res.status(404).json({
                message: "Disciplina não encontrada.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao excluir disciplina.",
        });
    }
}));
// Rotas de Turmas:
// Rota para obter turmas por disciplina
app.get("/turmas/disciplina/:id_disciplina", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_disciplina = Number(req.params.id_disciplina);
        const turmas = yield (0, turmas_1.getAllTurmasByDisciplina)(id_disciplina);
        res.json(turmas);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar turmas por disciplina",
        });
    }
}));
// Rota para obter turmas por Instituicão
app.get("/turmas/instituicao/:id_instituicao", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_instituicao = Number(req.params.id_instituicao);
        const turmas = yield (0, turmas_1.getAllTurmasByInstituicao)(id_instituicao);
        res.json(turmas);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar turmas por disciplina",
        });
    }
}));
// Rota para inserir uma turma
app.post("/turmas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, codigo, turno, id_disciplina } = req.body;
        if (!nome || !codigo || turno === undefined || !id_disciplina) {
            return res.status(400).json({
                error: "Campos Nome, Código e Turno são obrigatórios.",
            });
        }
        const id = yield (0, turmas_1.addTurma)(nome, codigo, Number(turno), id_disciplina);
        res.status(201).json({
            message: "Turma adicionada com sucesso.",
            id,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir turma.",
        });
    }
}));
// Rota para editar uma turma
app.put("/turmas/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, codigo, turno } = req.body;
        const id = Number(req.params.id);
        if (!nome || !codigo || !turno) {
            return res.status(400).json({
                error: "Campos Nome, Código e Turno são obrigatórios.",
            });
        }
        const updated = yield (0, turmas_1.updateTurma)(id, nome, codigo, turno);
        if (updated) {
            res.status(200).json({
                message: "Turma atualizada com sucesso.",
                id,
            });
        }
        else {
            res.status(404).json({
                message: "Turma não encontrada.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar turma.",
        });
    }
}));
// Rota para excluir uma turma
app.delete("/turmas/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const deleted = yield (0, turmas_1.deleteTurma)(id);
        if (deleted) {
            res.status(200).json({
                message: "Turma excluída com sucesso.",
                id,
            });
        }
        else {
            res.status(404).json({
                message: "Turma não encontrada.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao excluir turma.",
        });
    }
}));
// Rotas de Alunos:
// Rota para obter um aluno pelo RA
app.get("/alunos/:ra", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ra = req.params.ra;
        const aluno = yield (0, alunos_1.getAlunoByRA)(ra);
        if (aluno) {
            res.json(aluno);
        }
        else {
            res.status(404).json({
                message: "Aluno não foi encontrado com o RA fornecido.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar aluno pelo RA fornecido.",
        });
    }
}));
// Rota para obter alunos pela turma
app.get("/alunos/turma/:id_turma", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_turma = Number(req.params.id_turma);
        const alunos = yield (0, alunos_1.getAllAlunosByTurma)(id_turma);
        if (alunos) {
            res.json(alunos);
        }
        else {
            res.status(404).json({
                message: "Alunos não foram encontrados no id da turma fornecido.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar aluno pelo id fornecido.",
        });
    }
}));
// Rota para obter alunos pela instituicao
app.get("/alunos/instituicao/:id_instituicao", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_instituicao = req.params.id_instituicao;
        const alunos = yield (0, alunos_1.getAllAlunosByInstituicao)(Number(id_instituicao));
        if (alunos) {
            res.json(alunos);
        }
        else {
            res.status(404).json({
                message: "Alunos não foram encontrados no id da instituicao fornecido.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar aluno pelo id da turma fornecido.",
        });
    }
}));
// Rota para contar alunos por professor
app.get("/alunos/professor/:id_professor", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_professor = Number(req.params.id_professor);
        const countAlunos = yield (0, alunos_1.countAlunosByProfessor)(id_professor);
        if (countAlunos !== null) {
            res.json(countAlunos);
        }
        else {
            res.status(404).json({
                message: "Alunos não foram encontradas com o id fornecido.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar nota pelo ID fornecido.",
        });
    }
}));
// Rota para inserir um aluno em uma turma
app.post("/alunos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ra_aluno, nome, id_turma } = req.body;
        if (!ra_aluno || !nome || id_turma === undefined) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios.",
            });
        }
        const ra = yield (0, alunos_1.addAluno)(ra_aluno, nome, id_turma);
        res.status(201).json({
            message: "Aluno adicionado com sucesso.",
            ra,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir aluno.",
        });
    }
}));
// Rota para editar um aluno
app.put('/alunos/:ra', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome } = req.body;
        const ra_aluno = req.params.ra;
        if (!nome || !ra_aluno) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios."
            });
        }
        const updated = yield (0, alunos_1.updateAluno)(ra_aluno, nome);
        if (updated) {
            res.status(200).json({
                message: "Aluno atualizado com sucesso.", ra_aluno
            });
        }
        else {
            res.status(404).json({
                message: "Aluno não encontrado."
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar aluno."
        });
    }
}));
// Rota para excluir um aluno
app.delete("/alunos/:ra", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ra = req.params.ra;
        const deleted = yield (0, alunos_1.deleteAluno)(ra);
        if (deleted) {
            res.status(200).json({
                message: "Aluno excluído com sucesso.",
                ra,
            });
        }
        else {
            res.status(404).json({
                message: "Aluno não encontrado.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao excluir aluno.",
        });
    }
}));
// Rotas de Notas:
// Rota para obter nota pelo ID
app.get("/notas/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const nota = yield (0, notas_1.getNotaById)(id);
        if (nota) {
            res.json(nota);
        }
        else {
            res.status(404).json({
                message: "Nota não foi encontrada com o id fornecido.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar nota pelo ID fornecido.",
        });
    }
}));
// Rota para obter notas por turma
app.get("/notas/turma/:id_turma", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_turma = Number(req.params.id_turma);
        const nota = yield (0, notas_1.getNotasByTurma)(id_turma);
        if (nota) {
            res.json(nota);
        }
        else {
            res.status(404).json({
                message: "Nota não foi encontrada com o id fornecido.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar nota pelo ID fornecido.",
        });
    }
}));
// Rota para contar notas por professor
app.get("/notas/professor/:id_professor", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_professor = Number(req.params.id_professor);
        const countNotas = yield (0, notas_1.countNotasByProfessor)(id_professor);
        if (countNotas !== null) {
            res.json(countNotas);
        }
        else {
            res.status(404).json({
                message: "Notas não foram encontradas com o id fornecido.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar nota pelo ID fornecido.",
        });
    }
}));
// Rota para inserir nota, precisa de um componente e um aluno
app.post("/notas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { valor, id_componente, ra_aluno } = req.body;
        if (valor === undefined || valor === null) {
            return res.status(400).json({
                error: "Campo valor é obrigatório.",
            });
        }
        const id = yield (0, notas_1.addNota)(Number(valor), Number(id_componente), ra_aluno);
        res.status(201).json({
            message: "Nota adicionada com sucesso.",
            id,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir nota.",
        });
    }
}));
// Rota para editar nota
app.put("/notas/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { valor } = req.body;
        const id = Number(req.params.id);
        if (valor === undefined || valor === null) {
            return res.status(400).json({
                error: "Campo valor é obrigatório.",
            });
        }
        const updated = yield (0, notas_1.updateNota)(id, Number(valor));
        if (updated) {
            res.status(200).json({
                message: "Nota atualizada com sucesso.",
                id,
            });
        }
        else {
            res.status(404).json({
                message: "Nota não encontrada.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar nota.",
        });
    }
}));
// Rota para excluir uma nota
app.delete("/notas/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const deleted = yield (0, notas_1.deleteNota)(id);
        if (deleted) {
            res.status(200).json({
                message: "Nota excluída com sucesso.",
                id,
            });
        }
        else {
            res.status(404).json({
                message: "Nota não encontrada.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao excluir nota.",
        });
    }
}));
// Recuperação de Senha
app.post("/recuperar-senha", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        console.log('[RECUPERAR-SENHA] Requisição recebida para:', email);
        if (!email)
            return res.status(400).json({ error: "Email é obrigatório." });
        const token = yield (0, recuperacaoSenha_1.gerarTokenRecuperacao)(email);
        if (!token) {
            console.log('[RECUPERAR-SENHA] Email não encontrado:', email);
            return res.status(404).json({ error: "Email não encontrado." });
        }
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "notadezpi2@gmail.com", // seu Gmail real
                pass: "f q e d u z w s x t v z g i o m" // senha de app gerada no Gmail
            }
        });
        // link (ajuste para seu front)
        const link = `http://localhost:3000/pages/alterar_senha.html?token=${token}`;
        const mailOptions = {
            from: "NotaDez <no-reply@notadez.local>",
            to: email,
            subject: "Recuperação de senha - NotaDez",
            html: `<p>Para redefinir sua senha clique: <a href="${link}">${link}</a></p>`
        };
        const info = yield transporter.sendMail(mailOptions);
        console.log('[RECUPERAR-SENHA] E-mail enviado. info=', info);
        res.json({ message: "E-mail de recuperação enviado com sucesso!" });
    }
    catch (err) {
        console.error('[RECUPERAR-SENHA] Erro:', err);
        res.status(500).json({ error: "Erro ao enviar e-mail de recuperação. Confira logs do servidor." });
    }
}));
const recuperacaoSenha_2 = require("./db/recuperacaoSenha");
// ROTA PARA REDEFINIR SENHA
app.post("/redefinir-senha", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, novaSenha } = req.body;
        console.log("[REDEFINIR-SENHA] Token recebido:", token);
        if (!token || !novaSenha) {
            return res.status(400).json({ error: "Token e nova senha são obrigatórios." });
        }
        const email = yield (0, recuperacaoSenha_2.validarToken)(token);
        if (!email) {
            return res.status(400).json({ error: "Token inválido ou expirado." });
        }
        const ok = yield (0, recuperacaoSenha_2.redefinirSenha)(email, novaSenha);
        if (!ok) {
            return res.status(500).json({ error: "Erro ao atualizar senha." });
        }
        (0, recuperacaoSenha_2.invalidarToken)(token); // apaga o token depois de usar
        res.json({ message: "Senha alterada com sucesso!" });
    }
    catch (err) {
        console.error("[REDEFINIR-SENHA] Erro:", err);
        res.status(500).json({ error: "Erro interno ao redefinir senha." });
    }
}));
// Rotas de Componentes de Nota:
// Rota para Obter componente de nota por disciplina
app.get(`/componente-nota/disciplina/:id_disciplina`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_disciplina = Number(req.params.id_disciplina);
        const componentes = yield (0, notas_1.getComponentesByDisciplina)(id_disciplina);
        res.json(componentes);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar componentes de notas",
        });
    }
}));
// Rota para inserir componente de nota para disciplina
app.post(`/componente-nota`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, sigla, descricao, id_disciplina } = req.body;
        if (nome === null || sigla === null) {
            return res.status(400).json({
                error: "Campos Nome e Sigla são obrigatórios.",
            });
        }
        const id = yield (0, notas_1.addComponente)(nome, sigla, descricao, Number(id_disciplina));
        res.status(201).json({
            message: "componente adicionada com sucesso.",
            id
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir componente.",
        });
    }
}));
// Rota para editar componente de nota de disciplina
app.put("/componente-nota/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, sigla, descricao } = req.body;
        const id = Number(req.params.id);
        if (nome === null || sigla === null) {
            return res.status(400).json({
                error: "Campos Nome e Sigla são obrigatórios.",
            });
        }
        const updated = yield (0, notas_1.updateComponente)(nome, sigla, descricao, id);
        if (updated) {
            res.status(200).json({
                message: "Componente atualizada com sucesso.",
                id,
            });
        }
        else {
            res.status(404).json({
                message: "Componente não encontrado.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar Componente.",
        });
    }
}));
// Rota para editar componente de nota de disciplina
app.delete("/componente-nota/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const deleted = yield (0, notas_1.deleteComponente)(id);
        if (deleted) {
            res.status(200).json({
                message: "Componente excluída com sucesso.",
                id,
            });
        }
        else {
            res.status(404).json({
                message: "Componente não encontrada.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao Componente nota.",
        });
    }
}));
// Rotas de formula da disciplina:
// Rota para obter a formula da disciplina
app.get(`/formula/:id_disciplina`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_disciplina = Number(req.params.id_disciplina);
        const formula = yield (0, notas_1.getFormulaByDisciplina)(id_disciplina);
        res.json(formula);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar formula de disciplina",
        });
    }
}));
// Rota para inserir formula em uma disciplina
app.post(`/formula`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_disciplina, formula } = req.body;
        if (formula === undefined || formula === null) {
            return res.status(400).json({
                error: "Campo formula é obrigatório.",
            });
        }
        const id = yield (0, notas_1.addFormula)(formula, Number(id_disciplina));
        res.status(201).json({
            message: "Formula adicionada com sucesso.",
            id
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao inserir formula.",
        });
    }
}));
// Rota para editar formula de disciplina
app.put("/formula/:id_disciplina", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { formula } = req.body;
        const id_disciplina = Number(req.params.id_disciplina);
        if (formula === null) {
            return res.status(400).json({
                error: "Campo formula é obrigatório.",
            });
        }
        const updated = yield (0, notas_1.updateFormula)(id_disciplina, formula);
        if (updated) {
            res.status(200).json({
                message: "Formula atualizada com sucesso.",
                id_disciplina,
            });
        }
        else {
            res.status(404).json({
                message: "Formula não encontrada.",
            });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao atualizar formula.",
        });
    }
}));
// Rota para listar todas as entradas da auditoria por professor
app.get("/auditoria/professor/:id_professor", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_professor = Number(req.params.id_professor);
        const auditorias = yield (0, notas_1.getAuditoriaByProfessor)(id_professor);
        res.json(auditorias);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar auditorias pelo id do professor.",
        });
    }
}));
// Mensagem de Servidor Rodando:
app.listen(port, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
});
