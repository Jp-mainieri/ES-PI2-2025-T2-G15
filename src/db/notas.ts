import {open, close} from "../config/db";
import OracleDB from "oracledb";

export interface Nota{
    id_nota:number,
    valor:number
}

export interface ComponenteNota{
    id_componente_nota:number,
    nome:string,
}

export interface NotasAlunos {
    ra_aluno:string,
    nome:string,
    id_componente:number,
    valor:number,
    id_nota:number
}

export async function getAllNotas(): Promise<Nota[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_NOTA as "id_nota", VALOR as "valor" FROM NOTA`
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
            `SELECT ID_NOTA as "id_nota", VALOR as "valor" FROM NOTA
            WHERE ID_NOTA = :id`,
            [id]
        );
        return (result.rows && result.rows[0]) as Nota | null;
    }finally{
        await close(connection);
    }
}

export async function getComponentesByTurma(id_turma: number): Promise<ComponenteNota[] | null> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `
            SELECT cn.ID_COMPONENTE, cn.NOME
            FROM COMPONENTE_NOTA cn
            JOIN DISCIPLINAS d ON d.ID_DISCIPLINA = cn.ID_DISCIPLINA
            JOIN TURMAS t ON t.ID_DISCIPLINA = d.ID_DISCIPLINA
            WHERE t.ID_TURMA = :id_turma
            ORDER BY cn.ID_COMPONENTE
            `,
            [id_turma]
        );

        return result.rows as ComponenteNota[] || null;
    } finally {
        await close(connection);
    }
}

export async function getNotasByTurma(id_turma: number): Promise<NotasAlunos[] | null> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `
            SELECT a.RA_ALUNO as ra_aluno, a.NOME as nome, cn.id_componente, n.VALOR as valor, n.ID_NOTA
            FROM ALUNOS a
            JOIN TURMAS t ON t.ID_TURMA = a.ID_TURMA
            JOIN DISCIPLINAS d ON d.ID_DISCIPLINA = t.ID_DISCIPLINA
            JOIN COMPONENTE_NOTA cn ON cn.ID_DISCIPLINA = d.ID_DISCIPLINA
            LEFT JOIN NOTA n ON n.RA_ALUNO = a.RA_ALUNO AND n.ID_COMPONENTE = cn.ID_COMPONENTE
            WHERE a.ID_TURMA = :id_turma
            ORDER BY a.NOME, cn.id_componente
            `,
            [id_turma],
        );

        return result.rows as NotasAlunos[] || null;
    } finally {
        await close(connection);
    }
}

export async function addNota(valor: number, id_componente:number, ra_aluno:string): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO NOTA (VALOR, ID_COMPONENTE, RA_ALUNO)
            VALUES (:valor, :id_componente, :ra_aluno)
            RETURNING ID_NOTA INTO :id
            `,
            {valor,id_componente,ra_aluno, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
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
            `UPDATE NOTA
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
            `DELETE FROM NOTA WHERE ID_NOTA = :id`,
            [id],
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}
