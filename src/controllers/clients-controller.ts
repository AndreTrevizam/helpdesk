import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";

class ClientsController {
  async remove(req: Request, res: Response) {
    const userId = req.user?.id

    if (!userId) {
      throw new AppError("Usuário não existe")
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    res.json()
  }

  async update(req: Request, res: Response) {
    const bodySchema = z.object({
      password: z.string().trim().min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
    })

    const userId = req.user?.id

    if (!userId) {
      throw new AppError("Usuário não existe")
    }

    const { password } = bodySchema.parse(req.body)

    const newPassword = await hash(password, 8)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword
      }
    })

    res.json({ message: "Senha alterada com sucesso!" })
  }
}

export { ClientsController }