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
exports.getAllDisciplinas = getAllDisciplinas;
exports.getAllDisciplinasByCurso = getAllDisciplinasByCurso;
exports.getDisciplinaById = getDisciplinaById;
exports.addDisciplina = addDisciplina;
exports.updateDisciplina = updateDisciplina;
exports.deleteDisciplina = deleteDisciplina;
// Feito por João Pedro Panza Mainieri - 25006642
const db_1 = require("../config/db");
const oracledb_1 = __importDefault(require("oracledb"));
// Função para obter todas as Disciplinas
function getAllDisciplinas() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_DISCIPLINA as "id_disciplina", NOME as "nome", SIGLA as "sigla", 
            CODIGO as "codigo", PERIODO as "periodo" FROM DISCIPLINAS`);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter todas as disciplinas de um curso
function getAllDisciplinasByCurso(id_curso) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_DISCIPLINA as "id", NOME, SIGLA, 
            CODIGO, PERIODO FROM DISCIPLINAS WHERE ID_CURSO = :id_curso`, [id_curso]);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter uma disciplina pelo ID
function getDisciplinaById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_DISCIPLINA as "id", NOME, SIGLA, 
            CODIGO, PERIODO FROM DISCIPLINAS
            WHERE ID_DISCIPLINA = :id`, [id]);
            return (result.rows && result.rows[0]);
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para inserir disciplina
function addDisciplina(nome, sigla, codigo, periodo, id_curso) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
            INSERT INTO DISCIPLINAS (NOME, SIGLA, CODIGO, PERIODO, ID_CURSO)
            VALUES (:nome, :sigla, :codigo, :periodo, :id_curso)
            RETURNING ID_DISCIPLINA INTO :id
            `, { nome, sigla, codigo, periodo, id_curso, id: { dir: oracledb_1.default.BIND_OUT, type: oracledb_1.default.NUMBER } }, { autoCommit: true });
            const outBinds = result.outBinds;
            if (!outBinds || !outBinds.id || outBinds.id.length === 0) {
                throw new Error("Erro ao obter um ID retornado na insercao de Disciplina.");
            }
            return outBinds.id[0];
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para editar disciplina
function updateDisciplina(id, nome, sigla, codigo, periodo) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`UPDATE DISCIPLINAS 
            SET NOME = :nome, SIGLA = :sigla, CODIGO = :codigo, PERIODO = :periodo 
            WHERE ID_DISCIPLINA = :id`, { id, nome, sigla, codigo, periodo }, { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para excluir disciplina
function deleteDisciplina(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`DELETE FROM DISCIPLINAS WHERE ID_DISCIPLINA = :id`, [id], { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
