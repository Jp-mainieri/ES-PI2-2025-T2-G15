//Feito por Giovana Uchelli - 25008818
import OracleDB from "oracledb";
import { open, close } from "../config/db";
import crypto from "crypto";

// Armazena tokens em memória (token -> email)
const tokensAtivos = new Map<string, string>();

// Gera e guarda token temporário
export async function gerarTokenRecuperacao(email: string): Promise<string | null> {
  const connection = await open();
  try {
    // Verifica se o email existe
    const result = await connection.execute(
      `SELECT ID_PROFESSOR FROM PROFESSORES WHERE EMAIL = :email`,
      { email }
    );

    if (!result.rows || result.rows.length === 0) {
      return null; // Email não encontrado
    }

    const token = crypto.randomBytes(32).toString("hex");
    tokensAtivos.set(token, email);

    // Token expira em 15 minutos
    setTimeout(() => tokensAtivos.delete(token), 15 * 60 * 1000);

    return token;
  } finally {
    await close(connection);
  }
}

export async function validarToken(token: string): Promise<string | null> {
  return tokensAtivos.get(token) || null;
}

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

export function invalidarToken(token: string): void {
  tokensAtivos.delete(token);
}


