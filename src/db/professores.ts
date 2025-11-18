// Feito por João Pedro Panza Mainieri - 25006642
import {open, close} from "../config/db";
import OracleDB from "oracledb";

export interface Professor{
    id_professor:number,
    nome:string,
    telefone:string,
    senha:string,
    email:string
}

// Função para Obter todos os professores
export async function getAllProfessores(): Promise<Professor[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_PROFESSOR as "id_professor", NOME as "nome", TELEFONE as "telefone", 
            SENHA as "senha", "EMAIL" as "email" FROM PROFESSORES`
        );
        return result.rows as Professor[];
    }finally{
        await close(connection);
    }
}

// Função para Obter um professor pelo ID
export async function getProfessorById(id:number): Promise<Professor | null> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT ID_PROFESSOR as "id_professor", NOME as "nome", TELEFONE as "telefone", 
            SENHA as "senha", "EMAIL" as "email" FROM PROFESSORES
            WHERE ID_PROFESSOR = :id`,
            [id]
        );
        return (result.rows && result.rows[0]) as Professor | null;
    }finally{
        await close(connection);
    }
}

// Função para inserir um professor
export async function addProfessor(nome: string, telefone: string, senha: string, email: string): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO PROFESSORES (NOME, TELEFONE, SENHA, "EMAIL")
            VALUES (:nome, :telefone, :senha, :email)
            RETURNING ID_PROFESSOR INTO :id
            `,
            {nome, telefone, senha, email, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
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

// Função para editar um professor
export async function updateProfessor(id: number, nome: string, telefone: string, senha: string, email: string): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `UPDATE PROFESSORES 
            SET NOME = :nome, TELEFONE = :telefone, SENHA = :senha, "EMAIL" = :email 
            WHERE ID_PROFESSOR = :id`,
            {id, nome, telefone, senha, email},
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}
