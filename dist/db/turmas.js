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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTurmas = getAllTurmas;
exports.getAllTurmasByDisciplina = getAllTurmasByDisciplina;
exports.getAllTurmasByInstituicao = getAllTurmasByInstituicao;
exports.getTurmaById = getTurmaById;
exports.addTurma = addTurma;
exports.updateTurma = updateTurma;
exports.deleteTurma = deleteTurma;
// Feito por João Pedro Panza Mainieri - 25006642
const db_1 = require("../config/db");
const oracledb_1 = __importDefault(require("oracledb"));
// Função para obter todas as turmas
function getAllTurmas() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_TURMA as "id", NOME, CODIGO, TURNO FROM TURMAS`);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter todas as turmas de uma disciplina
function getAllTurmasByDisciplina(id_disciplina) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_TURMA as "id", NOME as "nome", CODIGO, 
            TURNO FROM TURMAS WHERE ID_DISCIPLINA = :id_disciplina`, [id_disciplina]);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter todas as turmas de uma Instituição
function getAllTurmasByInstituicao(id_instituicao) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT t.ID_TURMA as "id", t.NOME, t.CODIGO,
            t.TURNO FROM TURMAS t
            JOIN DISCIPLINAS d ON t.ID_DISCIPLINA = d.ID_DISCIPLINA
            JOIN CURSOS c ON d.ID_CURSO = c.ID_CURSO
            WHERE c.ID_INSTITUICAO = :id_instituicao`, { id_instituicao });
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter uma turma pelo ID
function getTurmaById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_TURMA as "ID", NOME, CODIGO, TURNO FROM TURMAS
            WHERE ID_TURMA = :id`, [id]);
            return (result.rows && result.rows[0]);
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para inserir uma turma
function addTurma(nome, codigo, turno, id_disciplina) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
            INSERT INTO TURMAS (NOME, CODIGO, TURNO, ID_DISCIPLINA)
            VALUES (:nome, :codigo, :turno, :id_disciplina)
            RETURNING ID_TURMA INTO :id
            `, { nome, codigo, turno, id_disciplina, id: { dir: oracledb_1.default.BIND_OUT, type: oracledb_1.default.NUMBER } }, { autoCommit: true });
            const outBinds = result.outBinds;
            if (!outBinds || !outBinds.id || outBinds.id.length === 0) {
                throw new Error("Erro ao obter um ID retornado na insercao de Turma.");
            }
            return outBinds.id[0];
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para editar uma turma
function updateTurma(id, nome, codigo, turno) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`UPDATE TURMAS 
            SET NOME = :nome, CODIGO = :sigla, TURNO = :turno
            WHERE ID_TURMA = :id`, { id, nome, codigo, turno }, { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para exluir uma turma
function deleteTurma(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`DELETE FROM TURMAS WHERE ID_TURMA = :id`, [id], { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
