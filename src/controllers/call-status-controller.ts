import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { Status } from "@prisma/client";

class CallStatusController {
  async update(req: Request, res: Response) {
    const paramsSchema = z.object({
      callId: z.string().uuid()
    })

    const bodySchema = z.object({
      newStatus: z.enum([Status.Closed, Status.InService, Status.Open])
    })

    const { callId } = paramsSchema.parse(req.params)
    const { newStatus } = bodySchema.parse(req.body)

    const call = await prisma.call.findFirst({
      where: { id: callId }
    })

    const currentStatus = call?.status

    // Esse é o fluxo das transições de status
    const allowedTransitions: Record<Status, Status[]> = {
      [Status.Open]: [Status.InService],
      [Status.InService]: [Status.Closed],
      [Status.Closed]: []
    }

    if (!Object.values(Status).includes(newStatus)) {
      throw new AppError("Status inválido")
    }

    const statusEnum = newStatus

    if (!currentStatus) {
      throw new AppError("Status atual do chamado não encontrado!")
    }

    const allowedNextStatuses  = allowedTransitions[call.status]

    if (!allowedNextStatuses .includes(statusEnum)) {
      throw new AppError("Transição não permitida")
    }

    await prisma.call.update({
      where: { id: callId },
      data: {
        status: statusEnum
      }
    })

    res.json({ message: "Status atualizado com sucesso!" })
  }
}

export { CallStatusController }