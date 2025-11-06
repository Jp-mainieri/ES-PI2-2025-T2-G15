import {open,close} from "../config/db";
import OracleDB from "oracledb";

export interface Instituicao{
    id_instituicao:number,
    nome:string,
}

// Função para obter instituições

export async function getAllInstituicoes(): Promise<Instituicao[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            'SELECT id_instituicao as "id", NOME as "nome" FROM INSTITUICOES'
        );
        return result.rows as Instituicao[];
    }finally {
        await close(connection);
    }
}

// Função para obter instituição por professor

export async function getAllInstituicoesByProfessor(id_professor: number): Promise<Instituicao[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            'SELECT id_instituicao as "id", nome FROM INSTITUICOES WHERE id_professor = :id_professor',
            [id_professor]
        )
        return result.rows as Instituicao[];
    }finally {
        await close(connection);
    }
}

// Função para obter instituição por id

export async function getInstituicaoById(id: number): Promise<Instituicao | null> {
    const connection = await open();
    try{
        const result = await connection.execute(
            'SELECT id_instituicao as "id", nome FROM INSTITUICOES WHERE id_instituicao = :id',
            [id]
        )
        return (result.rows && result.rows[0]) as Instituicao | null;
    }finally {
        await close(connection);
    }
}

// Função para adicionar uma instituição

export async function addInstituicao(nome: string, id_professor: number): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO INSTITUICOES (NOME, ID_PROFESSOR)
            VALUES (:nome,:id_professor)
            RETURNING id_instituicao INTO :id
            `,
            {nome,id_professor ,id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
            {autoCommit: true}
        );

        const outBinds = result.outBinds as {id?: number[]} | undefined;

        if(!outBinds || !outBinds.id || outBinds.id.length === 0){
            throw new Error("Erro ao obter um ID retornado na insercao de Instituição.");
        }

        return outBinds.id[0];

    }finally{
        await close(connection);
    }
}

// Função para editar instituicao

export async function updateInstituicao(id:number, nome: string): Promise<boolean>{
    const connection = await open();
    try {
        const result = await connection.execute(
            `
                UPDATE INSTITUICOES
                SET nome = :nome
                WHERE id_instituicao = :id
            `,
            {nome, id},
            {autoCommit: true}
        );
        return (result.rowsAffected ?? 0) > 0;
    }finally {
        await close(connection);
    }
}

// Função para excluir instituicao

export async function deleteInstituicao(id:number): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `
                DELETE FROM INSTITUICOES
                WHERE id_instituicao = :id
            `,
            [id],
            {autoCommit: true}
        )

        return (result.rowsAffected ?? 0) > 0;
    }finally {
        await close(connection);
    }
}