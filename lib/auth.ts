import * as jwt from "jsonwebtoken"; 

import bcrypt from "bcryptjs";

const TOKEN_SECRET = process.env.TOKEN_SECRET!; // Agregar en .env

// Crear JWT
export function signToken(payload: any) {
  return jwt.sign(payload, TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

// Verificar JWT
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, TOKEN_SECRET);
  } catch {
    return null;
  }
}

// Hashear contraseña
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Verificar contraseña
export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}


import crypto from "crypto";

export function generateVerifyToken() {
  return crypto.randomBytes(32).toString("hex");
}
