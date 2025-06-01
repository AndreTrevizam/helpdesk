import { Request, Response } from "express";
import { CreateUserService } from "@/services/createUserService";
import { UserRole } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { availableHours } from "@/utils/available-hours";
import { AppError } from "@/utils/AppError";

class TechniciansController {
  async create(req: Request, res: Response) {
    // Força a role a ser Technician
    req.body.role = UserRole.Technician

    const createUserService = new CreateUserService()
    const user = await createUserService.createUser(req, res)

    // Verifica se o horario é valido a partir da array definida
    const bodySchema = z.object({
      availableTimes: z.array(z.enum(availableHours))
    })

    const { availableTimes } = bodySchema.parse(req.body)

    await prisma.technician.create({
      data: {
        userId: user.id,
        availableTimes
      }
    })

    res.status(201).json()
  }

  async index(req: Request, res: Response) {
    const querySchema = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(5)
    })

    const { name, page, perPage } = querySchema.parse(req.query)

    const skip = (page - 1) * perPage

    const technicians = await prisma.technician.findMany({
      skip,
      take: perPage,
      where: {
        user: {
          name: {
            contains: name.trim()
          }
        }
      },
      include: {
        user: true
      },
      orderBy: {
        user: {
          createdAt: "desc"
        }
      }
    })

    const totalRecords = await prisma.technician.count({
      where: {
        user: {
          name: {
            contains: name.trim()
          }
        }
      }
    })

    const totalPages = Math.ceil(totalRecords / perPage)

    const techniciansWithoutPassword = technicians.map(({ user, ...technician }) => ({
      ...technician,
      user: user
        ? { ...user, password: undefined } // Remove a senha, mantém o resto
        : undefined
    }))

    res.json({
      technicians: techniciansWithoutPassword,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1
      }
    })
  }

  async show(req: Request, res: Response) {
    const userId = req.user?.id

    if (!userId) {
      throw new AppError("Usuário não existe")
    }

    const technician = await prisma.technician.findFirst({
      where: { userId }
    })

    const calls = await prisma.call.findMany({
      where: { technicianId: technician?.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            filename: true
          }
        },
        services: {
          include: {
            service: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.json(calls)
  }
}

export { TechniciansController }