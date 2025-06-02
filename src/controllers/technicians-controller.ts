import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class TechniciansController {

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

  async update(req: Request, res: Response) {
    const bodySchema = z.object({
      serviceId: z.string().uuid()
    })

    const paramsSchema = z.object({
      callId: z.string().uuid()
    })

    const { serviceId } = bodySchema.parse(req.body)
    const { callId } = paramsSchema.parse(req.params)

    const userId = req.user?.id
    if (!userId) {
      throw new AppError("Usuário não existe")
    }

    // Busca o técnico pelo userId
    const technician = await prisma.technician.findFirst({
      where: { userId }
    })
    
    if (!technician) {
      throw new AppError("Técnico não encontrado")
    }

    // Busca o chamado e verifica se pertence ao técnico
    const call = await prisma.call.findUnique({
      where: { id: callId }
    })
    if (!call || call.technicianId !== technician.id) {
      throw new AppError("Você não tem permissão para atualizar este chamado")
    }

    if (!serviceId) {
      throw new AppError("Serviço não encontrado")
    }

    const updatedCall = await prisma.call.update({
      where: { id: callId },
      data: {
        services: {
          create: { serviceId }
        }
      },
      include: {
        services: true
      }
    })

    res.json(updatedCall)
  }
}

export { TechniciansController }