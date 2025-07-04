import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class CallsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      title: z.string().trim().min(1, { message: "De um título para o chamado" }),
      description: z.string().trim().min(1, { message: "De uma descrição para o chamado" }),
      serviceId: z.string().uuid()
    })

    const userId = req.user?.id

    if (!userId) {
      throw new AppError("Usuário não existe")
    }

    const { title, description, serviceId } = bodySchema.parse(req.body)

    const technicians = await prisma.technician.findMany()

    if (technicians.length === 0) {
      throw new AppError("Não existe nenhum técnico cadastrado.")
    }

    const randomTechnician = technicians[Math.floor(Math.random() * technicians.length)]

    const call = await prisma.call.create({
      data: {
        title,
        description,
        user: { connect: { id: userId } },
        technician: { connect: { id: randomTechnician.id } },
        services: {
          create: [
            {
              service: { connect: { id: serviceId } }
            }
          ]
        }
      },
      include: {
        services: {
          include: {
            service: true
          }
        }
      }
    })

    const totalAmount = call.services.reduce((sum, cs) => sum + cs.service.amount, 0)

    res.json({
      ...call,
      totalAmount: Number(totalAmount.toFixed(2))
    })
  }

  async index(req: Request, res: Response) {
    const userId = req.user?.id

    const querySchema = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(5)
    })

    const { name, page, perPage } = querySchema.parse(req.query)
    const skip = (page - 1) * perPage

    if (!userId) {
      throw new AppError("Usuário não existe!")
    }

    const calls = await prisma.call.findMany({
      skip,
      take: perPage,
      where: {
        userId,
        title: {
          contains: name.trim()
        }
      },
      include: {
        services: {
          include: {
            service: true
          }
        }
      }
    })


    const totalRecords = await prisma.call.count({
      where: {
        userId,
        title: {
          contains: name.trim()
        }
      }
    })

    const totalPages = Math.ceil(totalRecords / perPage)

    const callsWithTotal = calls.map(call => {
      const totalAmount = call.services.reduce((sum, cs) => sum + cs.service.amount, 0)
      return {
        ...call,
        totalAmount: Number(totalAmount.toFixed(2))
      }
    })

    res.json({
      callsWithTotal,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1
      }
    })
  }
}

export { CallsController }