import {open,close} from "../config/db";
import OracleDB, {autoCommit} from "oracledb";

export interface Instituicao{
    id:number,
    nome:string
}

export async function getAllInstituicoes(): Promise<Instituicao[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            'SELECT ID as "id", NOME as "nome" FROM INSTITUICOES'
        );
        return result.rows as Instituicao[];
    }finally {
        await close(connection);
    }
}

export async function getInstituicaoById(id:number): Promise<Instituicao | null> {
    const connection = await open();
    try{
        const result = await connection.execute(
            'SELECT ID as "id", NOME as "nome" FROM INSTITUICOES WHERE ID = :id',
            [id]
        )
        return (result.rows && result.rows[0]) as Instituicao | null;
    }finally {
        await close(connection);
    }
}

export async function addInstituicao(nome: string): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO INSTITUICOES (NOME)
            VALUES (:nome)
            RETURNING ID INTO :id
            `,
            {nome, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
            {autoCommit: true}
        );

        const outBinds = result.outBinds as {id?: number[]} | undefined;

        if(!outBinds || !outBinds.id || outBinds.id.length === 0){
            throw new Error("Erro ao obter um ID retornado na insercao de Estudante.");
        }

        return outBinds.id[0];

    }finally{
        await close(connection);
    }
}