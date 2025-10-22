import OracleDB from "oracledb";

// caminho da wallet de conexão com o oracle.
const walletPath = "C:/oracle/Wallet_jpDB01";

// inicializar o cliente oracle, usando a wallet.
OracleDB.initOracleClient({configDir: walletPath});

// formato de saida dos dados, vai ser objetos JS estruturados.
OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

const dbConfig = {
    user: "WEBAPP",
    password: "PI2Grupo15$$",
    connectString: "joaopedromainieridatabase01_high"
}

// funcao para abrir conexões com o oracle.
export async function open(){
    try{
        const connection = await  OracleDB.getConnection(dbConfig);
        console.log("Conexao OCI - aberta");
        return connection;
    }catch (err){
        console.error(`Erro ao abrir conexão com o Oracle: ${err}`)
        throw err;
    }
}

// funcao para fechar conexão com o oracle.
export async function close(connection: OracleDB.Connection){
    try{
        await  connection.close();
        console.log("Conexao OCI - fechada");
    }catch (err){
        console.error(`Erro ao fechar conexão com o Oracle: ${err}`)
        throw err;
    }
}