import {open, close} from "../config/db";
import OracleDB from "oracledb";

export interface Curso{
    id_curso:number,
    nome:string,
    id_instituicao:number
}

export async function getAllCursos(): Promise<Curso[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_CURSO as "id_curso", NOME FROM CURSOS`
        );
        return result.rows as Curso[];
    }finally{
        await close(connection);
    }
}

export async function getAllCursosByInstituicao(id_instituicao: number): Promise<Curso[]> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `SELECT ID_CURSO as "id", NOME
             FROM CURSOS 
             WHERE ID_INSTITUICAO = :id_instituicao`,
            [id_instituicao]
        )
        return result.rows as Curso[];
    }finally{
        await close(connection);
    }
}


export async function getCursoById(id:number): Promise<Curso | null> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_CURSO as "id", NOME as "nome" FROM CURSOS
            WHERE ID_CURSO = :id`,
            [id]
        );
        return (result.rows && result.rows[0]) as Curso | null;
    }finally{
        await close(connection);
    }
}

export async function addCurso(nome: string, id_instituicao: number): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO CURSOS (NOME, ID_INSTITUICAO)
            VALUES (:nome, :id_instituicao)
            RETURNING ID_CURSO INTO :id
            `,
            {nome, id_instituicao, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
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

export async function updateCurso(id: number, nome: string): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `UPDATE CURSOS 
            SET NOME = :nome
            WHERE ID_CURSO = :id`,
            {id, nome},
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
