// Feito por João Pedro Panza Mainieri - 25006642
import {open, close} from "../config/db";
import OracleDB from "oracledb";
import {Instituicao} from "./instituicoes";

export interface Nota{
    id_nota:number,
    valor:number
}

export interface ComponenteNota{
    id_componente_nota:number,
    nome:string,
    sigla:string
    descricao:string
}

export interface NotasAlunos {
    ra_aluno:string,
    nome:string,
    id_componente:number,
    valor:number,
    id_nota:number
}

export interface Formula {
    id_formula:number,
    formula:string,
    id_disciplina:number,
}

export interface CountResult {
    total: number;
}

export interface Auditoria {
    descricao: string,
    data_hora: string
}

// Função para obter todas as notas
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

// Função para obter uma nota pelo id
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

// Função para obter todas as notas de uma turma
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

        return result.rows as NotasAlunos[] | null;
    } finally {
        await close(connection);
    }
}

// Função para obter todas as notas de um professor
export async function countNotasByProfessor(id_professor: number): Promise<CountResult | null> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `
                SELECT COUNT(n.ID_NOTA) AS total_notas
                FROM NOTA n
                         JOIN COMPONENTE_NOTA cn ON cn.ID_COMPONENTE = n.ID_COMPONENTE
                         JOIN DISCIPLINAS d ON d.ID_DISCIPLINA = cn.ID_DISCIPLINA
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


// Função para inserir uma nota
export async function addNota(valor: number, id_componente:number, ra_aluno:string): Promise <number> {
    const connection = await open()
    try {
        const result = await connection.execute<{outBinds : {id:number}}>(
            `
            INSERT INTO NOTA (RA_ALUNO, VALOR, ID_COMPONENTE)
            VALUES (:ra_aluno ,:valor, :id_componente)
            RETURNING ID_NOTA INTO :id
            `,
            {ra_aluno ,valor, id_componente,id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
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

// Função para editar uma nota
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

// Função para excluir uma nota
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

// Função para obter a formula de uma disciplina
export async function getFormulaByDisciplina(id_disciplina: number): Promise<Formula | null> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `
            SELECT ID_FORMULA, FORMULA, ID_DISCIPLINA
            FROM FORMULA_DISCIPLINA 
            WHERE ID_DISCIPLINA= :id_disciplina
            `,
            [id_disciplina]
        );

        return (result.rows && result.rows[0]) as Formula | null;
    } finally {
        await close(connection);
    }
}

// Função para inserir a formula de uma disciplina
export async function addFormula(formula:string,id_disciplina: number): Promise<Number> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `
            INSERT INTO FORMULA_DISCIPLINA 
            (FORMULA, ID_DISCIPLINA) 
            VALUES (:formula, :id_disciplina)
            RETURNING ID_FORMULA INTO :id
            `,
            {formula, id_disciplina, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
            {autoCommit: true}
        );

        const outBinds = result.outBinds as {id?: number[]} | undefined;

        if(!outBinds || !outBinds.id || outBinds.id.length === 0){
            throw new Error("Erro ao obter um ID retornado na insercao de Nota.");
        }

        return outBinds.id[0];
    } finally {
        await close(connection);
    }
}

// Função para editar a formula de uma disciplina
export async function updateFormula(id_disciplina: number, formula: string): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `UPDATE FORMULA_DISCIPLINA
            SET FORMULA = :formula 
            WHERE ID_DISCIPLINA = :id_disciplina`,
            {id_disciplina, formula},
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}

// Função para obter os componentes de uma disciplina
export async function getComponentesByDisciplina(id_disciplina: number): Promise<ComponenteNota[] | null> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `
            SELECT ID_COMPONENTE, NOME, SIGLA, DESCRICAO
            FROM COMPONENTE_NOTA
            WHERE ID_DISCIPLINA= :id_disciplina
            `,
            [id_disciplina]
        );

        return result.rows as ComponenteNota[] | null;
    } finally {
        await close(connection);
    }
}

// Função para inserir um componente em uma disciplina
export async function addComponente(nome:string, sigla:string, descricao:string, id_disciplina: number): Promise<Number> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `
            INSERT INTO COMPONENTE_NOTA 
            (NOME, SIGLA,DESCRICAO, ID_DISCIPLINA) 
            VALUES (:nome, :sigla, :descricao, :id_disciplina)
            RETURNING ID_COMPONENTE INTO :id
            `,
            {nome, sigla,descricao, id_disciplina, id: {dir:OracleDB.BIND_OUT, type: OracleDB.NUMBER}},
            {autoCommit: true}
        );

        const outBinds = result.outBinds as {id?: number[]} | undefined;

        if(!outBinds || !outBinds.id || outBinds.id.length === 0){
            throw new Error("Erro ao obter um ID retornado na insercao de Nota.");
        }

        return outBinds.id[0];
    } finally {
        await close(connection);
    }
}

// Função para editar um componente de uma disciplina
export async function updateComponente(nome: string, sigla: string,descricao:string, id_componente:number): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `UPDATE COMPONENTE_NOTA
            SET NOME = :nome, SIGLA = :sigla, DESCRICAO = :descricao
            WHERE ID_COMPONENTE = :id_componente`,
            {nome, sigla,descricao, id_componente},
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}

// Função para ecluir um componente de uma disciplina
export async function deleteComponente(id: number): Promise<boolean> {
    const connection = await open();
    try {
        const result = await connection.execute(
            `DELETE FROM COMPONENTE_NOTA WHERE ID_COMPONENTE = :id`,
            [id],
            {autoCommit: true}
        );

        return (result.rowsAffected ?? 0) > 0;
    } finally {
        await close(connection);
    }
}

export async function getAuditoriaByProfessor(id_professor: number): Promise<Auditoria[]> {
    const connection = await open();
    try{
        const result = await connection.execute(
            `SELECT DESCRICAO as "descricao", DATA_HORA as "data_hora" FROM AUDITORIA WHERE id_professor = :id_professor ORDER BY DATA_HORA DESC`,
            [id_professor]
        )
        return result.rows as Auditoria[];
    }finally {
        await close(connection);
    }
}