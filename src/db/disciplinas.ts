import {open, close} from "../config/db";
import OracleDB from "oracledb";

export interface Disciplina{
    id_disciplina:number,
    nome:string,
    sigla:string,
    codigo:string,
    periodo:number
}

export async function getAllDisciplinas(): Promise<Disciplina[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_DISCIPLINA as "id_disciplina", NOME as "nome", SIGLA as "sigla", 
            CODIGO as "codigo", PERIODO as "periodo" FROM DISCIPLINAS`
        );
        return result.rows as Disciplina[];
    }finally{
        await close(connection);
    }
}

export async function getAllDisciplinasByCurso(id_curso:number): Promise<Disciplina[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_DISCIPLINA as "id", NOME, SIGLA, 
            CODIGO, PERIODO FROM DISCIPLINAS WHERE ID_CURSO = :id_curso`,
            [id_curso]
        );
        return result.rows as Disciplina[];
    }finally{
        await close(connection);
    }
}

export async function getDisciplinaById(id:number): Promise<Disciplina | null> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_DISCIPLINA as "id", NOME, SIGLA, 
            CODIGO, PERIODO FROM DISCIPLINAS
            WHERE ID_DISCIPLINA = :id`,
            [id]
        );
        return (result.rows && result.rows[0]) as Disciplina | null;
    }finally{
        await close(connection);
    }
}

export async function addDisciplina(nome: string, sigla: string, codigo: string, periodo: number, id_curso:number): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO DISCIPLINAS (NOME, SIGLA, CODIGO, PERIODO, ID_CURSO)
            VALUES (:nome, :sigla, :codigo, :periodo, :id_curso)
            RETURNING ID_DISCIPLINA INTO :id
            `,
            {nome, sigla, codigo, periodo, id_curso, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
            {autoCommit: true}
        );

        const outBinds = result.outBinds as {id?: number[]} | undefined;

        if(!outBinds || !outBinds.id || outBinds.id.length === 0){
            throw new Error("Erro ao obter um ID retornado na insercao de Disciplina.");
        }

        return outBinds.id[0];

    }finally{
        await close(connection);
    }
}

export async function updateDisciplina(id: number, nome: string, sigla: string, codigo: string, periodo: number): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `UPDATE DISCIPLINAS 
            SET NOME = :nome, SIGLA = :sigla, CODIGO = :codigo, PERIODO = :periodo 
            WHERE ID_DISCIPLINA = :id`,
            {id, nome, sigla, codigo, periodo},
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}

export async function deleteDisciplina(id: number): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `DELETE FROM DISCIPLINAS WHERE ID_DISCIPLINA = :id`,
            [id],
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}
