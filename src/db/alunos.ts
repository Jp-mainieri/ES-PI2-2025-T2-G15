import {open, close} from "../config/db";
import OracleDB from "oracledb";

export interface Aluno{
    ra_aluno:string,
    nome:string,
    matricula:string,
    curso:string,
    data_nascimento:Date
}

export async function getAllAlunos(): Promise<Aluno[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT RA_ALUNO as "ra_aluno", NOME as "nome", "MATRÍCULA" as "matricula", 
            CURSO as "curso", DATA_NASCIMENTO as "data_nascimento" FROM ALUNOS`
        );
        return result.rows as Aluno[];
    }finally{
        await close(connection);
    }
}

export async function getAlunoByRA(ra:string): Promise<Aluno | null> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT RA_ALUNO as "ra_aluno", NOME as "nome", "MATRÍCULA" as "matricula", 
            CURSO as "curso", DATA_NASCIMENTO as "data_nascimento" FROM ALUNOS
            WHERE RA_ALUNO = :ra`,
            [ra]
        );
        return (result.rows && result.rows[0]) as Aluno | null;
    }finally{
        await close(connection);
    }
}

export async function addAluno(ra_aluno: string, nome: string, matricula: string, curso: string, data_nascimento: Date): Promise <string> {
    const connection = await open()
    try {
        await connection.execute(
            `
            INSERT INTO ALUNOS (RA_ALUNO, NOME, "MATRÍCULA", CURSO, DATA_NASCIMENTO)
            VALUES (:ra_aluno, :nome, :matricula, :curso, :data_nascimento)
            `,
            {ra_aluno, nome, matricula, curso, data_nascimento},
            {autoCommit: true}
        );

        return ra_aluno;

    }finally{
        await close(connection);
    }
}

export async function updateAluno(ra_aluno: string, nome: string, matricula: string, curso: string, data_nascimento: Date): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `UPDATE ALUNOS 
            SET NOME = :nome, "MATRÍCULA" = :matricula, CURSO = :curso, DATA_NASCIMENTO = :data_nascimento 
            WHERE RA_ALUNO = :ra_aluno`,
            {ra_aluno, nome, matricula, curso, data_nascimento},
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}

export async function deleteAluno(ra: string): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `DELETE FROM ALUNOS WHERE RA_ALUNO = :ra`,
            [ra],
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}
