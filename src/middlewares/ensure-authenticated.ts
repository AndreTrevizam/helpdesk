import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/AppError"
import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"

interface TokenPayload {
  role: string
  sub: string
}

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {

    // Procura o token
    const authHeader = req.headers.authorization

    // Caso não encontre o token
    if (!authHeader) {
      throw new AppError("JWT Token não encontrado")
    }

    // Encontrou, agora pega apenas o token (tira o bearer)
    const [, token] = authHeader.split(" ")

    // Verificar se o token é válido
    const { role, sub: user_id } = verify(token, authConfig.jwt.secret) as TokenPayload

    // Salvar o token no user pegando o id do user e a role dele
    req.user = {
      id: user_id,
      role
    }

    // Passa pra frente
    return next()

  } catch (error) {
    throw new AppError("JWT Token inválido")
  }
}

export { ensureAuthenticated }