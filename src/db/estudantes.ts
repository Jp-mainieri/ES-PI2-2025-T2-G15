import {open, close} from "../config/db";
import OracleDB, {autoCommit} from "oracledb";

export interface Estudante{
    id:number,
    ra:string,
    nome:string,
    email:string
}

// obter todos os estudantes da tabela Estudantes do Oracle.
export async function getAllEstudantes(): Promise<Estudante[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID as "id", RA as "ra", NOME as "nome", EMAIL as "email" FROM ESTUDANTES`
        );
        return result.rows as Estudante[];
    }finally{
        await close(connection);
    }
}

export async function getEstudanteById(id:number): Promise<Estudante | null> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID as "id", RA as "ra", NOME as "nome", EMAIL as "email" FROM ESTUDANTES
            WHERE ID = :id`,
            [id]
        );
        return (result.rows && result.rows[0]) as Estudante | null;
    }finally{
        await close(connection);
    }
}

export async function addEstudante(ra: string, nome: string, email:string): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO ESTUDANTES (RA, NOME, EMAIL)
            VALUES (:ra, :nome, :email)
            RETURNING ID INTO :id
            `,
            {ra,nome,email, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
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