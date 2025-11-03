import {open, close} from "../config/db";
import OracleDB from "oracledb";

export interface Nota{
    id_nota:number,
    valor:number
}

export async function getAllNotas(): Promise<Nota[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_NOTA as "id_nota", VALOR as "valor" FROM NOTAS`
        );
        return result.rows as Nota[];
    }finally{
        await close(connection);
    }
}

export async function getNotaById(id:number): Promise<Nota | null> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_NOTA as "id_nota", VALOR as "valor" FROM NOTAS
            WHERE ID_NOTA = :id`,
            [id]
        );
        return (result.rows && result.rows[0]) as Nota | null;
    }finally{
        await close(connection);
    }
}

export async function addNota(valor: number): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO NOTAS (VALOR)
            VALUES (:valor)
            RETURNING ID_NOTA INTO :id
            `,
            {valor, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
            {autoCommit: true}
        );

        const outBinds = result.outBinds as {id?: number[]} | undefined;

        if(!outBinds || !outBinds.id || outBinds.id.length === 0){
            throw new Error("Erro ao obter um ID retornado na insercao de Nota.");
        }

        return outBinds.id[0];

    }finally{
        await close(connection);
    }
}

export async function updateNota(id: number, valor: number): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `UPDATE NOTAS 
            SET VALOR = :valor 
            WHERE ID_NOTA = :id`,
            {id, valor},
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}

export async function deleteNota(id: number): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `DELETE FROM NOTAS WHERE ID_NOTA = :id`,
            [id],
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}
