// Feito por João Pedro Panza Mainieri - 25006642
import OracleDB from "oracledb";
import dotenv from "dotenv";

// carrega as variáveis do .env
dotenv.config();

// caminho da wallet de conexão com o oracle, vindo do .env
const walletPath = process.env.ORACLE_WALLET_DIR as string;

// inicializar o cliente oracle, usando a wallet.
OracleDB.initOracleClient({
    libDir: process.env.ORACLE_LIB_DIR,
    configDir: walletPath
});

// formato de saída dos dados: objetos JS
OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

const dbConfig = {
    user: process.env.ORACLE_USER as string,
    password: process.env.ORACLE_PASSWORD as string,
    connectString: process.env.ORACLE_CONNECT_STRING as string
}

// função para abrir conexões com o oracle.
export async function open(){
    try{
        const connection = await OracleDB.getConnection(dbConfig);
        console.log("Conexao OCI - aberta");
        return connection;
    }catch (err){
        console.error(`Erro ao abrir conexão com o Oracle: ${err}`)
        throw err;
    }
}

// função para fechar conexão com o oracle.
export async function close(connection: OracleDB.Connection){
    try{
        await connection.close();
        console.log("Conexao OCI - fechada");
    }catch (err){
        console.error(`Erro ao fechar conexão com o Oracle: ${err}`)
        throw err;
    }
}
