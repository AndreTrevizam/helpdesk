import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod"
import { hash } from "bcrypt"
import { UserRole } from "@prisma/client";

class UsersControllers {
  async create(req: Request, res: Response) {

    const bodySchema = z.object({
      name: z.string().trim().min(3, { message: "O nome de ter no mínimo 3 letras" }),
      email: z.string().email(),
      password: z.string().trim().min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
      role: z.enum([UserRole.Client, UserRole.Admin, UserRole.Technician]).default(UserRole.Client)
    })

    const { name, email, password, role } = bodySchema.parse(req.body)

    const userWithSameEmail = await prisma.user.findFirst({
      where: { email }
    })

    if (userWithSameEmail) {
      throw new AppError("E-mail já cadastrado!")
    }

    const hashedPassword = await hash(password, 8)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    })

    res.status(201).json()
  }
}

export { UsersControllers }