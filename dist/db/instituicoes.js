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
exports.getAllInstituicoes = getAllInstituicoes;
exports.getInstituicaoById = getInstituicaoById;
exports.addInstituicao = addInstituicao;
exports.updateInstituicao = updateInstituicao;
exports.deleteInstituicao = deleteInstituicao;
const db_1 = require("../config/db");
const oracledb_1 = __importDefault(require("oracledb"));
// Função para obter instituições
function getAllInstituicoes() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute('SELECT ID as "id", NOME as "nome" FROM INSTITUICOES');
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter instituição por id
function getInstituicaoById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute('SELECT ID as "id", NOME as "nome" FROM INSTITUICOES WHERE ID = :id', [id]);
            return (result.rows && result.rows[0]);
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para adicionar uma instituição
function addInstituicao(nome) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
            INSERT INTO INSTITUICOES (NOME)
            VALUES (:nome)
            RETURNING ID INTO :id
            `, { nome, id: { dir: oracledb_1.default.BIND_OUT, type: oracledb_1.default.NUMBER } }, { autoCommit: true });
            const outBinds = result.outBinds;
            if (!outBinds || !outBinds.id || outBinds.id.length === 0) {
                throw new Error("Erro ao obter um ID retornado na insercao de Instituição.");
            }
            return outBinds.id[0];
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para editar instituicao
function updateInstituicao(id, nome) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
                UPDATE INSTITUICOES
                SET NOME = :nome
                WHERE ID = :id
            `, { nome, id }, { autoCommit: true });
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para excluir instituicao
function deleteInstituicao(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
                DELETE FROM INSTITUICOES
                WHERE ID = :id
            `, [id], { autoCommit: true });
            return id;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
