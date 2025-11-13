import {open, close} from "../config/db";
import OracleDB from "oracledb";

export async function getAlunosByTurma(id_turma: number) {
    const connection = await open();
    try {
        const result = await connection.execute(
            `SELECT a.RA_aluno, a.Nome, a.Matricula, a.Curso, a.Data_Nascimento
             FROM ALUNOS a
             INNER JOIN TURMAS_ALUNOS ta ON a.RA_aluno = ta.RA_aluno
             WHERE ta.id_turma = :id_turma`,
            [id_turma],
            {outFormat: OracleDB.OUT_FORMAT_OBJECT}
        );
        return result.rows;
    } catch (err) {
        console.error("Erro ao buscar alunos da turma:", err);
        throw err;
    } finally {
        if (connection) {
            await close(connection);
        }
    }
}

export async function addAlunoToTurma(id_turma: number, ra_aluno: string) {
    const connection = await open();
    try {
        await connection.execute(
            `INSERT INTO TURMAS_ALUNOS (id_turma, RA_aluno) VALUES (:id_turma, :ra_aluno)`,
            [id_turma, ra_aluno],
            {autoCommit: true}
        );
        return true;
    } catch (err) {
        console.error("Erro ao adicionar aluno à turma:", err);
        throw err;
    } finally {
        if (connection) {
            await close(connection);
        }
    }
}

export async function removeAlunoFromTurma(id_turma: number, ra_aluno: string) {
    const connection = await open();
    try {
        const result = await connection.execute(
            `DELETE FROM TURMAS_ALUNOS WHERE id_turma = :id_turma AND RA_aluno = :ra_aluno`,
            [id_turma, ra_aluno],
            {autoCommit: true}
        );
        return result.rowsAffected && result.rowsAffected > 0;
    } catch (err) {
        console.error("Erro ao remover aluno da turma:", err);
        throw err;
    } finally {
        if (connection) {
            await close(connection);
        }
    }
}
