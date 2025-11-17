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
// Feito por João Pedro Panza Mainieri - 25006642
const oracledb_1 = __importDefault(require("oracledb"));
const dotenv_1 = __importDefault(require("dotenv"));
// carrega as variáveis do .env
dotenv_1.default.config();
// caminho da wallet de conexão com o oracle, vindo do .env
const walletPath = process.env.ORACLE_WALLET_DIR;
// inicializar o cliente oracle, usando a wallet.
oracledb_1.default.initOracleClient({
    libDir: process.env.ORACLE_LIB_DIR,
    configDir: walletPath
});
// formato de saída dos dados: objetos JS
oracledb_1.default.outFormat = oracledb_1.default.OUT_FORMAT_OBJECT;
const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING
};
// função para abrir conexões com o oracle.
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
// função para fechar conexão com o oracle.
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
