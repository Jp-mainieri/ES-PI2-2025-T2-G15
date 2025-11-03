import {open, close} from "../config/db";
import OracleDB from "oracledb";

export interface Professor{
    id_professor:number,
    nome:string,
    telefone:string,
    senha:string,
    diciplina:string,
    email:string
}

export async function getAllProfessores(): Promise<Professor[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_PROFESSOR as "id_professor", NOME as "nome", TELEFONE as "telefone", 
            SENHA as "senha", DICIPLINA as "diciplina", "E-MAIL" as "email" FROM PROFESSORES`
        );
        return result.rows as Professor[];
    }finally{
        await close(connection);
    }
}

export async function getProfessorById(id:number): Promise<Professor | null> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_PROFESSOR as "id_professor", NOME as "nome", TELEFONE as "telefone", 
            SENHA as "senha", DICIPLINA as "diciplina", "E-MAIL" as "email" FROM PROFESSORES
            WHERE ID_PROFESSOR = :id`,
            [id]
        );
        return (result.rows && result.rows[0]) as Professor | null;
    }finally{
        await close(connection);
    }
}

export async function addProfessor(nome: string, telefone: string, senha: string, diciplina: string, email: string): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO PROFESSORES (NOME, TELEFONE, SENHA, DICIPLINA, "E-MAIL")
            VALUES (:nome, :telefone, :senha, :diciplina, :email)
            RETURNING ID_PROFESSOR INTO :id
            `,
            {nome, telefone, senha, diciplina, email, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
            {autoCommit: true}
        );

        const outBinds = result.outBinds as {id?: number[]} | undefined;

        if(!outBinds || !outBinds.id || outBinds.id.length === 0){
            throw new Error("Erro ao obter um ID retornado na insercao de Professor.");
        }

        return outBinds.id[0];

    }finally{
        await close(connection);
    }
}

export async function updateProfessor(id: number, nome: string, telefone: string, senha: string, diciplina: string, email: string): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `UPDATE PROFESSORES 
            SET NOME = :nome, TELEFONE = :telefone, SENHA = :senha, DICIPLINA = :diciplina, "E-MAIL" = :email 
            WHERE ID_PROFESSOR = :id`,
            {id, nome, telefone, senha, diciplina, email},
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}

export async function deleteProfessor(id: number): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `DELETE FROM PROFESSORES WHERE ID_PROFESSOR = :id`,
            [id],
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}
