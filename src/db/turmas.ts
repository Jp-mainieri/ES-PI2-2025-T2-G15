import {open, close} from "../config/db";
import OracleDB from "oracledb";

export interface Turma{
    id_turma:number,
    nome:string,
    codigo:string,
    turno:number,

}

export async function getAllTurmas(): Promise<Turma[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_TURMA as "id", NOME, CODIGO, TURNO FROM TURMAS`
        );
        return result.rows as Turma[];
    }finally{
        await close(connection);
    }
}

export async function getAllTurmasByDisciplina(id_disciplina:number): Promise<Turma[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_TURMA as "id", NOME as "nome", CODIGO, 
            TURNO FROM TURMAS WHERE ID_DISCIPLINA = :id_disciplina`,
            [id_disciplina]
        );
        return result.rows as Turma[];
    }finally{
        await close(connection);
    }
}

export async function getAllTurmasByInstituicao(id_instituicao:number): Promise<Turma[]>{
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT t.ID_TURMA as "id", t.NOME, t.CODIGO,
            t.TURNO FROM TURMAS t
            JOIN DISCIPLINAS d ON t.ID_DISCIPLINA = d.ID_DISCIPLINA
            JOIN CURSOS c ON d.ID_CURSO = c.ID_CURSO
            WHERE c.ID_INSTITUICAO = :id_instituicao`,
            {id_instituicao}
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
            `SELECT ID_TURMA as "ID", NOME, CODIGO, TURNO FROM TURMAS
            WHERE ID_TURMA = :id`,
            [id]
        );
        return (result.rows && result.rows[0]) as Turma | null;
    }finally{
        await close(connection);
    }
}

export async function addTurma(nome: string, codigo: string, turno:number, id_disciplina:number): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO TURMAS (NOME, CODIGO, TURNO, ID_DISCIPLINA)
            VALUES (:nome, :codigo, :turno, :id_disciplina)
            RETURNING ID_TURMA INTO :id
            `,
            {nome, codigo, turno, id_disciplina, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
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

export async function updateTurma(id: number, nome: string, codigo: string, turno:string): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `UPDATE TURMAS 
            SET NOME = :nome, CODIGO = :sigla, TURNO = :turno
            WHERE ID_TURMA = :id`,
            {id, nome, codigo, turno},
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
