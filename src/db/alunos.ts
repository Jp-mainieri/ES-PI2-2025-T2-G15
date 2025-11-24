// Feito por João Pedro Panza Mainieri - 25006642
import {open, close} from "../config/db";
import {CountResult, Nota} from "./notas";

export interface Aluno{
    ra_aluno:string,
    nome:string,
    id_turma:number
}

// Função para obter todos os alunos

export async function getAllAlunos(): Promise<Aluno[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT RA_ALUNO, NOME, ID_TURMA FROM ALUNOS`
        );
        return result.rows as Aluno[];
    }finally{
        await close(connection);
    }
}

// Função para obter todos os alunos de uma turma
export async function getAllAlunosByTurma(id_turma:number): Promise<Aluno[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT RA_ALUNO, NOME FROM ALUNOS WHERE ID_TURMA = :id_turma`,
            [id_turma]
        );
        return result.rows as Aluno[];
    }finally{
        await close(connection);
    }
}

// Função para obter todos os alunos de uma intituicao
export async function getAllAlunosByInstituicao(id_instituicao: number): Promise<Aluno[]> {
    const connection = await open()
    try{
        const result = await connection.execute(
        `SELECT a.RA_ALUNO as "RA_ALUNO", a.NOME as "NOME", a.ID_TURMA as "ID_TURMA"
        FROM ALUNOS a
        WHERE a.ID_TURMA IN (
        SELECT t.ID_TURMA 
        FROM TURMAS t
        JOIN DISCIPLINAS d ON t.ID_DISCIPLINA = d.ID_DISCIPLINA
        JOIN CURSOS c ON d.ID_CURSO = c.ID_CURSO
        WHERE c.ID_INSTITUICAO = :id_instituicao)`,
            [id_instituicao]
        );
        return result.rows as Aluno[];
    }finally {
        await close(connection);
    }
}

// Função para contar os alunos de um professor
export async function countAlunosByProfessor(id_professor: number): Promise<CountResult | null > {
    const connection = await open();
    try {
        const result = await connection.execute(
            `
                SELECT COUNT(a.RA_ALUNO) AS total_alunos
                FROM ALUNOS a
                         JOIN TURMAS t ON t.ID_TURMA = a.ID_TURMA
                         JOIN DISCIPLINAS d ON d.ID_DISCIPLINA = t.ID_DISCIPLINA
                         JOIN CURSOS c ON c.ID_CURSO = d.ID_CURSO
                         JOIN INSTITUICOES i ON i.ID_INSTITUICAO = c.ID_INSTITUICAO
                WHERE i.ID_PROFESSOR = :id_professor
            `,
            { id_professor }
        );

        return (result.rows && result.rows[0]) as CountResult | null;
    }finally {
        await close(connection);
    }
}

// Função para obter o aluno pelo RA
export async function getAlunoByRA(ra:string): Promise<Aluno | null> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT RA_ALUNO, NOME, 
            ID_TURMA FROM ALUNOS
            WHERE RA_ALUNO = :ra`,
            [ra]
        );
        return (result.rows && result.rows[0]) as Aluno | null;
    }finally{
        await close(connection);
    }
}

// Função para inserir um aluno
export async function addAluno(ra_aluno: string, nome: string, id_turma:number): Promise <string> {
    const connection = await open()
    try {
        await connection.execute(
            `
            INSERT INTO ALUNOS (RA_ALUNO, NOME, ID_TURMA)
            VALUES (:ra_aluno, :nome, :id_turma)
            `,
            {ra_aluno, nome, id_turma},
            {autoCommit: true}
        );

        return ra_aluno;

    }finally{
        await close(connection);
    }
}

// Função para editar um aluno
export async function updateAluno(ra_aluno: string, nome: string): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `UPDATE ALUNOS 
            SET NOME = :nome
            WHERE RA_ALUNO = :ra_aluno`,
            {ra_aluno, nome},
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}

// Função para deletar um aluno
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
