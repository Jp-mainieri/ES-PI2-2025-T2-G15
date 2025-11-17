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
exports.getAllCursos = getAllCursos;
exports.getAllCursosByInstituicao = getAllCursosByInstituicao;
exports.getCursoById = getCursoById;
exports.addCurso = addCurso;
exports.updateCurso = updateCurso;
exports.deleteCurso = deleteCurso;
// Feito por João Pedro Panza Mainieri - 25006642
const db_1 = require("../config/db");
const oracledb_1 = __importDefault(require("oracledb"));
// Função para obter todos os cursos
function getAllCursos() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_CURSO as "id_curso", NOME FROM CURSOS`);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter todos os cursos de uma instituição
function getAllCursosByInstituicao(id_instituicao) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_CURSO as "id", NOME, CODIGO
             FROM CURSOS 
             WHERE ID_INSTITUICAO = :id_instituicao`, [id_instituicao]);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter um curso pelo ID
function getCursoById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_CURSO as "id", NOME as "nome" FROM CURSOS
            WHERE ID_CURSO = :id`, [id]);
            return (result.rows && result.rows[0]);
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para inserir um curso
function addCurso(nome, codigo, id_instituicao) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
            INSERT INTO CURSOS (NOME,CODIGO, ID_INSTITUICAO)
            VALUES (:nome, :codigo , :id_instituicao)
            RETURNING ID_CURSO INTO :id
            `, {
                nome,
                codigo,
                id_instituicao,
                id: { dir: oracledb_1.default.BIND_OUT, type: oracledb_1.default.NUMBER },
            }, { autoCommit: true });
            const outBinds = result.outBinds;
            if (!outBinds || !outBinds.id || outBinds.id.length === 0) {
                throw new Error("Erro ao obter um ID retornado na insercao de Curso.");
            }
            return outBinds.id[0];
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para editar um curso
function updateCurso(id, nome, codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`UPDATE CURSOS 
            SET NOME = :nome, CODIGO = :codigo
            WHERE ID_CURSO = :id`, { id, nome, codigo }, { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para excluir um curso
function deleteCurso(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`DELETE FROM CURSOS WHERE ID_CURSO = :id`, [id], { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
