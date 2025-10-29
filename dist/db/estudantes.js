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
exports.getAllEstudantes = getAllEstudantes;
exports.getEstudanteById = getEstudanteById;
exports.addEstudante = addEstudante;
const db_1 = require("../config/db");
const oracledb_1 = __importDefault(require("oracledb"));
// obter todos os estudantes da tabela Estudantes do Oracle.
function getAllEstudantes() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID as "id", RA as "ra", NOME as "nome", EMAIL as "email" FROM ESTUDANTES`);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
function getEstudanteById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID as "id", RA as "ra", NOME as "nome", EMAIL as "email" FROM ESTUDANTES
            WHERE ID = :id`, [id]);
            return (result.rows && result.rows[0]);
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
function addEstudante(ra, nome, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
            INSERT INTO ESTUDANTES (RA, NOME, EMAIL)
            VALUES (:ra, :nome, :email)
            RETURNING ID INTO :id
            `, { ra, nome, email, id: { dir: oracledb_1.default.BIND_OUT, type: oracledb_1.default.NUMBER } }, { autoCommit: true });
            const outBinds = result.outBinds;
            if (!outBinds || !outBinds.id || outBinds.id.length === 0) {
                throw new Error("Erro ao obter um ID retornado na insercao de Estudante.");
            }
            return outBinds.id[0];
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
