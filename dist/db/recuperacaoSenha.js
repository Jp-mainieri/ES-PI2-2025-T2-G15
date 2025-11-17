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
exports.gerarTokenRecuperacao = gerarTokenRecuperacao;
exports.validarToken = validarToken;
exports.redefinirSenha = redefinirSenha;
exports.invalidarToken = invalidarToken;
const db_1 = require("../config/db");
const crypto_1 = __importDefault(require("crypto"));
// mapa que guarda tokens temporários (token -> email)
const tokensAtivos = new Map();
// gera um token de recuperação e associa ao email
function gerarTokenRecuperacao(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            // verifica se o email existe no banco
            const result = yield connection.execute(`SELECT ID_PROFESSOR FROM PROFESSORES WHERE EMAIL = :email`, { email });
            if (!result.rows || result.rows.length === 0) {
                return null; // Email não encontrado
            }
            // cria token aleatório
            const token = crypto_1.default.randomBytes(32).toString("hex");
            tokensAtivos.set(token, email);
            // apaga o token depois de 15 minutos
            setTimeout(() => tokensAtivos.delete(token), 15 * 60 * 1000);
            return token;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// retorna o email vinculado ao token
function validarToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return tokensAtivos.get(token) || null;
    });
}
// atualiza a senha do professor no banco
function redefinirSenha(email, novaSenha) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, db_1.open)();
        try {
            const result = yield connection.execute(`UPDATE PROFESSORES SET SENHA = :novaSenha WHERE EMAIL = :email`, { novaSenha, email }, { autoCommit: true });
            return result.rowsAffected > 0;
        }
        finally {
            yield (0, db_1.close)(connection);
        }
    });
}
// remove o token da memória
function invalidarToken(token) {
    tokensAtivos.delete(token);
}
