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
exports.open = open;
exports.close = close;
const oracledb_1 = __importDefault(require("oracledb"));
// caminho da wallet de conexão com o oracle.
const walletPath = "C:/oracle/Wallet_jpDB01";
// inicializar o cliente oracle, usando a wallet.
oracledb_1.default.initOracleClient({ configDir: walletPath });
// formato de saida dos dados, vai ser objetos JS estruturados.
oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
const dbConfig = {
    user: "WEBAPP",
    password: "PI2Grupo15$$",
    connectString: "joaopedromainieridatabase01_high"
};
// funcao para abrir conexões com o oracle.
function open() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield oracledb_1.default.getConnection(dbConfig);
            console.log("Conexao OCI - aberta");
            return connection;
        }
        catch (err) {
            console.error(`Erro ao abrir conexão com o Oracle: ${err}`);
            throw err;
        }
    });
}
// funcao para fechar conexão com o oracle.
function close(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connection.close();
            console.log("Conexao OCI - fechada");
        }
        catch (err) {
            console.error(`Erro ao fechar conexão com o Oracle: ${err}`);
            throw err;
        }
    });
}
