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
exports.getAllProfessores = getAllProfessores;
exports.getProfessorById = getProfessorById;
exports.addProfessor = addProfessor;
exports.updateProfessor = updateProfessor;
// Feito por João Pedro Panza Mainieri - 25006642
const db_1 = require("../config/db");
const oracledb_1 = __importDefault(require("oracledb"));
// Função para Obter todos os professores
function getAllProfessores() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_PROFESSOR as "id_professor", NOME as "nome", TELEFONE as "telefone", 
            SENHA as "senha", "EMAIL" as "email" FROM PROFESSORES`);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para Obter um professor pelo ID
function getProfessorById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_PROFESSOR as "id_professor", NOME as "nome", TELEFONE as "telefone", 
            SENHA as "senha", "EMAIL" as "email" FROM PROFESSORES
            WHERE ID_PROFESSOR = :id`, [id]);
            return (result.rows && result.rows[0]);
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para inserir um professor
function addProfessor(nome, telefone, senha, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
            INSERT INTO PROFESSORES (NOME, TELEFONE, SENHA, "EMAIL")
            VALUES (:nome, :telefone, :senha, :email)
            RETURNING ID_PROFESSOR INTO :id
            `, { nome, telefone, senha, email, id: { dir: oracledb_1.default.BIND_OUT, type: oracledb_1.default.NUMBER } }, { autoCommit: true });
            const outBinds = result.outBinds;
            if (!outBinds || !outBinds.id || outBinds.id.length === 0) {
                throw new Error("Erro ao obter um ID retornado na insercao de Professor.");
            }
            return outBinds.id[0];
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para editar um professor
function updateProfessor(id, nome, telefone, senha, email) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`UPDATE PROFESSORES 
            SET NOME = :nome, TELEFONE = :telefone, SENHA = :senha, "EMAIL" = :email 
            WHERE ID_PROFESSOR = :id`, { id, nome, telefone, senha, email }, { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
