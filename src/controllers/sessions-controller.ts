import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod"
import { compare } from "bcrypt";
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";

class SessionsController {
  async create(req: Request, res: Response) {

    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(1, { message: "Senha é obrigatório" })
    })

    const { email, password } = bodySchema.parse(req.body)

    const user = await prisma.user.findFirst({
      where: { email }
    })

    if (!user) {
      throw new AppError("E-mail ou senha inválidos!")
    }

    const validPassword = await compare(password, user.password)

    if (!validPassword) {
      throw new AppError("E-mail ou senha inválidos!")
    }

    const { secret, expiresIn } = authConfig.jwt

    // A função sign gera um token JWT
    // O primeiro argumento é o dado que eu quero incluir no token, ou seja, a role do usuario
    // O secret garante a autenticidade do token
    // O objeto define no subject o identificador do usuario
    // O expiresIn é o tempo de expiração do token
    console.log({ secret, expiresIn, userId: user.id, role: user.role })
    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn
    })

    res.json({ token })
  }
}

export { SessionsController }