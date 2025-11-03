import {open, close} from "../config/db";
import OracleDB from "oracledb";

export interface Curso{
    id_curso:number,
    nome:string,
    sigla:string
}

export async function getAllCursos(): Promise<Curso[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_CURSO as "id_curso", NOME as "nome", SIGLA as "sigla" FROM CURSOS`
        );
        return result.rows as Curso[];
    }finally{
        await close(connection);
    }
}

export async function getCursoById(id:number): Promise<Curso | null> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_CURSO as "id_curso", NOME as "nome", SIGLA as "sigla" FROM CURSOS
            WHERE ID_CURSO = :id`,
            [id]
        );
        return (result.rows && result.rows[0]) as Curso | null;
    }finally{
        await close(connection);
    }
}

export async function addCurso(nome: string, sigla: string): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO CURSOS (NOME, SIGLA)
            VALUES (:nome, :sigla)
            RETURNING ID_CURSO INTO :id
            `,
            {nome, sigla, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
            {autoCommit: true}
        );

        const outBinds = result.outBinds as {id?: number[]} | undefined;

        if(!outBinds || !outBinds.id || outBinds.id.length === 0){
            throw new Error("Erro ao obter um ID retornado na insercao de Curso.");
        }

        return outBinds.id[0];

    }finally{
        await close(connection);
    }
}

export async function updateCurso(id: number, nome: string, sigla: string): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `UPDATE CURSOS 
            SET NOME = :nome, SIGLA = :sigla 
            WHERE ID_CURSO = :id`,
            {id, nome, sigla},
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}

export async function deleteCurso(id: number): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `DELETE FROM CURSOS WHERE ID_CURSO = :id`,
            [id],
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}
