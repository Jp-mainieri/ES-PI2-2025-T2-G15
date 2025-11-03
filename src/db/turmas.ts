import {open, close} from "../config/db";
import OracleDB from "oracledb";

export interface Turma{
    id_turma:number,
    nome:string,
    sigla:string
}

export async function getAllTurmas(): Promise<Turma[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_TURMA as "id_turma", NOME as "nome", SIGLA as "sigla" FROM TURMAS`
        );
        return result.rows as Turma[];
    }finally{
        await close(connection);
    }
}

export async function getTurmaById(id:number): Promise<Turma | null> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_TURMA as "id_turma", NOME as "nome", SIGLA as "sigla" FROM TURMAS
            WHERE ID_TURMA = :id`,
            [id]
        );
        return (result.rows && result.rows[0]) as Turma | null;
    }finally{
        await close(connection);
    }
}

export async function addTurma(nome: string, sigla: string): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO TURMAS (NOME, SIGLA)
            VALUES (:nome, :sigla)
            RETURNING ID_TURMA INTO :id
            `,
            {nome, sigla, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
            {autoCommit: true}
        );

        const outBinds = result.outBinds as {id?: number[]} | undefined;

        if(!outBinds || !outBinds.id || outBinds.id.length === 0){
            throw new Error("Erro ao obter um ID retornado na insercao de Turma.");
        }

        return outBinds.id[0];

    }finally{
        await close(connection);
    }
}

export async function updateTurma(id: number, nome: string, sigla: string): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `UPDATE TURMAS 
            SET NOME = :nome, SIGLA = :sigla 
            WHERE ID_TURMA = :id`,
            {id, nome, sigla},
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}

export async function deleteTurma(id: number): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `DELETE FROM TURMAS WHERE ID_TURMA = :id`,
            [id],
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}
