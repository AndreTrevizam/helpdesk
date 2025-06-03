import { Request, Response } from "express";
import { CreateUserService } from "@/services/createUserService";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class UsersControllers {
  async create(req: Request, res: Response) {
    const createUserService = new CreateUserService()
    const user = await createUserService.createUser(req, res)

    res.status(201).json(user)
  }

  async index(req: Request, res: Response) {
    const querySchema = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(5)
    })

    const { name, page, perPage } = querySchema.parse(req.query)

    const skip = (page - 1) * perPage

    const users = await prisma.user.findMany({
      skip,
      take: perPage,
      where: {
        name: {
          contains: name.trim()
        },
        role: 'Client'
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    const totalRecords = await prisma.user.count({
      where: {
        name: {
          contains: name.trim()
        },
        role: 'Client'
      }
    })

    const totalPages = Math.ceil(totalRecords / perPage)

    const usersWithoutPassword = users.map(({ password, ...user }) => user)

    res.json({
      users: usersWithoutPassword,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1
      }
    })
  }

  async update(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3, { message: "O nome de ter no mínimo 3 letras" }),
      email: z.string().email(),
    })

    const paramsSchema = z.object({
      userId: z.string().uuid()
    })

    const { userId } = paramsSchema.parse(req.params)
    const { name, email } = bodySchema.parse(req.body)

    const userExists = await prisma.user.findFirst({
      where: { id: userId }
    })

    if (!userExists) {
      throw new AppError("Usuário não encontrado")
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email
      }
    })

    const { password, ...userWithoutPassword } = updatedUser

    res.json(userWithoutPassword)
  }

  async remove(req: Request, res: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(req.params)

    if (!id) {
      throw new AppError("ID inexistente")
    }

    await prisma.user.delete({
      where: { id }
    })

    res.json()
  }
}

export { UsersControllers }