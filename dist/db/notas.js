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
exports.getAllNotas = getAllNotas;
exports.getNotaById = getNotaById;
exports.getNotasByTurma = getNotasByTurma;
exports.addNota = addNota;
exports.updateNota = updateNota;
exports.deleteNota = deleteNota;
exports.getFormulaByDisciplina = getFormulaByDisciplina;
exports.addFormula = addFormula;
exports.updateFormula = updateFormula;
exports.getComponentesByDisciplina = getComponentesByDisciplina;
exports.addComponente = addComponente;
exports.updateComponente = updateComponente;
exports.deleteComponente = deleteComponente;
// Feito por João Pedro Panza Mainieri - 25006642
const db_1 = require("../config/db");
const oracledb_1 = __importDefault(require("oracledb"));
// Função para obter todas as notas
function getAllNotas() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_NOTA as "id_nota", VALOR as "valor" FROM NOTA`);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter uma nota pelo id
function getNotaById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`SELECT ID_NOTA as "id_nota", VALOR as "valor" FROM NOTA
            WHERE ID_NOTA = :id`, [id]);
            return (result.rows && result.rows[0]);
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter todas as notas de uma turma
function getNotasByTurma(id_turma) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
            SELECT a.RA_ALUNO as ra_aluno, a.NOME as nome, cn.id_componente, n.VALOR as valor, n.ID_NOTA
            FROM ALUNOS a
            JOIN TURMAS t ON t.ID_TURMA = a.ID_TURMA
            JOIN DISCIPLINAS d ON d.ID_DISCIPLINA = t.ID_DISCIPLINA
            JOIN COMPONENTE_NOTA cn ON cn.ID_DISCIPLINA = d.ID_DISCIPLINA
            LEFT JOIN NOTA n ON n.RA_ALUNO = a.RA_ALUNO AND n.ID_COMPONENTE = cn.ID_COMPONENTE
            WHERE a.ID_TURMA = :id_turma
            ORDER BY a.NOME, cn.id_componente
            `, [id_turma]);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para inserir uma nota
function addNota(valor, id_componente, ra_aluno) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
            INSERT INTO NOTA (RA_ALUNO, VALOR, ID_COMPONENTE)
            VALUES (:ra_aluno ,:valor, :id_componente)
            RETURNING ID_NOTA INTO :id
            `, { ra_aluno, valor, id_componente, id: { dir: oracledb_1.default.BIND_OUT, type: oracledb_1.default.NUMBER } }, { autoCommit: true });
            const outBinds = result.outBinds;
            if (!outBinds || !outBinds.id || outBinds.id.length === 0) {
                throw new Error("Erro ao obter um ID retornado na insercao de Nota.");
            }
            return outBinds.id[0];
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para editar uma nota
function updateNota(id, valor) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`UPDATE NOTA
            SET VALOR = :valor 
            WHERE ID_NOTA = :id`, { id, valor }, { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para excluir uma nota
function deleteNota(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`DELETE FROM NOTA WHERE ID_NOTA = :id`, [id], { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter a formula de uma disciplina
function getFormulaByDisciplina(id_disciplina) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
            SELECT ID_FORMULA, FORMULA, ID_DISCIPLINA
            FROM FORMULA_DISCIPLINA 
            WHERE ID_DISCIPLINA= :id_disciplina
            `, [id_disciplina]);
            return (result.rows && result.rows[0]);
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para inserir a formula de uma disciplina
function addFormula(formula, id_disciplina) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
            INSERT INTO FORMULA_DISCIPLINA 
            (FORMULA, ID_DISCIPLINA) 
            VALUES (:formula, :id_disciplina)
            RETURNING ID_FORMULA INTO :id
            `, { formula, id_disciplina, id: { dir: oracledb_1.default.BIND_OUT, type: oracledb_1.default.NUMBER } }, { autoCommit: true });
            const outBinds = result.outBinds;
            if (!outBinds || !outBinds.id || outBinds.id.length === 0) {
                throw new Error("Erro ao obter um ID retornado na insercao de Nota.");
            }
            return outBinds.id[0];
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para editar a formula de uma disciplina
function updateFormula(id_disciplina, formula) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`UPDATE FORMULA_DISCIPLINA
            SET FORMULA = :formula 
            WHERE ID_DISCIPLINA = :id_disciplina`, { id_disciplina, formula }, { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para obter os componentes de uma disciplina
function getComponentesByDisciplina(id_disciplina) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
            SELECT ID_COMPONENTE, NOME, SIGLA, DESCRICAO
            FROM COMPONENTE_NOTA
            WHERE ID_DISCIPLINA= :id_disciplina
            `, [id_disciplina]);
            return result.rows;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para inserir um componente em uma disciplina
function addComponente(nome, sigla, descricao, id_disciplina) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`
            INSERT INTO COMPONENTE_NOTA 
            (NOME, SIGLA,DESCRICAO, ID_DISCIPLINA) 
            VALUES (:nome, :sigla, :descricao, :id_disciplina)
            RETURNING ID_COMPONENTE INTO :id
            `, { nome, sigla, descricao, id_disciplina, id: { dir: oracledb_1.default.BIND_OUT, type: oracledb_1.default.NUMBER } }, { autoCommit: true });
            const outBinds = result.outBinds;
            if (!outBinds || !outBinds.id || outBinds.id.length === 0) {
                throw new Error("Erro ao obter um ID retornado na insercao de Nota.");
            }
            return outBinds.id[0];
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para editar um componente de uma disciplina
function updateComponente(nome, sigla, descricao, id_componente) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`UPDATE COMPONENTE_NOTA
            SET NOME = :nome, SIGLA = :sigla, DESCRICAO = :descricao
            WHERE ID_COMPONENTE = :id_componente`, { nome, sigla, descricao, id_componente }, { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// Função para ecluir um componente de uma disciplina
function deleteComponente(id) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`DELETE FROM COMPONENTE_NOTA WHERE ID_COMPONENTE = :id`, [id], { autoCommit: true });
            return ((_a = result.rowsAffected) !== null && _a !== void 0 ? _a : 0) > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
