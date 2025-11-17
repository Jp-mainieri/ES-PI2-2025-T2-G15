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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAlunos = getAllAlunos;
exports.getAllAlunosByTurma = getAllAlunosByTurma;
exports.getAllAlunosByInstituicao = getAllAlunosByInstituicao;
exports.getAlunoByRA = getAlunoByRA;
exports.addAluno = addAluno;
exports.updateAluno = updateAluno;
exports.deleteAluno = deleteAluno;
// Feito por João Pedro Panza Mainieri - 25006642
const db_1 = require("../config/db");
// Função para obter todos os alunos
function getAllAlunos() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT RA_ALUNO, NOME, ID_TURMA FROM ALUNOS`);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter todos os alunos de uma turma
function getAllAlunosByTurma(id_turma) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT RA_ALUNO, NOME FROM ALUNOS WHERE ID_TURMA = :id_turma`[id_turma]);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter todos os alunos de uma intituicao
function getAllAlunosByInstituicao(id_instituicao) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT a.RA_ALUNO as "RA_ALUNO", a.NOME as "NOME", a.ID_TURMA as "ID_TURMA"
        FROM ALUNOS a
        WHERE a.ID_TURMA IN (
        SELECT t.ID_TURMA 
        FROM TURMAS t
        JOIN DISCIPLINAS d ON t.ID_DISCIPLINA = d.ID_DISCIPLINA
        JOIN CURSOS c ON d.ID_CURSO = c.ID_CURSO
        WHERE c.ID_INSTITUICAO = :id_instituicao)`, [id_instituicao]);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter o aluno pelo RA
function getAlunoByRA(ra) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT RA_ALUNO, NOME, 
            ID_TURMA FROM ALUNOS
            WHERE RA_ALUNO = :ra`, [ra]);
            return (result.rows && result.rows[0]);
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para inserir um aluno
function addAluno(ra_aluno, nome, id_turma) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            yield connection.execute(`
            INSERT INTO ALUNOS (RA_ALUNO, NOME, ID_TURMA)
            VALUES (:ra_aluno, :nome, :id_turma)
            `, { ra_aluno, nome, id_turma }, { autoCommit: true });
            return ra_aluno;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para editar um aluno
function updateAluno(ra_aluno, nome) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`UPDATE ALUNOS 
            SET NOME = :nome
            WHERE RA_ALUNO = :ra_aluno`, { ra_aluno, nome }, { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para deletar um aluno
function deleteAluno(ra) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`DELETE FROM ALUNOS WHERE RA_ALUNO = :ra`, [ra], { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
