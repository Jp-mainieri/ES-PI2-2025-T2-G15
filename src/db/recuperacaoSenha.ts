//Feito por Giovana Uchelli - 25008818
import OracleDB from "oracledb";
import { open, close } from "../config/db";
import crypto from "crypto";

// mapa que guarda tokens temporários (token -> email)
const tokensAtivos = new Map<string, string>();

// gera um token de recuperação e associa ao email
export async function gerarTokenRecuperacao(email: string): Promise<string | null> {
  const connection = await open();
  try {
    // verifica se o email existe no banco
    const result = await connection.execute(
      `SELECT ID_PROFESSOR FROM PROFESSORES WHERE EMAIL = :email`,
      { email }
    );

    if (!result.rows || result.rows.length === 0) {
      return null; // Email não encontrado
    }

    // cria token aleatório
    const token = crypto.randomBytes(32).toString("hex");
    tokensAtivos.set(token, email);

    // apaga o token depois de 15 minutos
    setTimeout(() => tokensAtivos.delete(token), 15 * 60 * 1000);

    return token;
  } finally {
    await close(connection);
  }
}

// retorna o email vinculado ao token
export async function validarToken(token: string): Promise<string | null> {
  return tokensAtivos.get(token) || null;
}

// atualiza a senha do professor no banco
export async function redefinirSenha(email: string, novaSenha: string): Promise<boolean> {
  const connection = await open();
  try {
    const result = await connection.execute(
      `UPDATE PROFESSORES SET SENHA = :novaSenha WHERE EMAIL = :email`,
      { novaSenha, email },
      { autoCommit: true }
    );
    return result.rowsAffected! > 0;
  } finally {
    await close(connection);
  }
}

// remove o token da memória
export function invalidarToken(token: string): void {
  tokensAtivos.delete(token);
}


