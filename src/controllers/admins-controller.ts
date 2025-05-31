import { Request, Response } from "express";
import { CreateUserService } from "@/services/createUserService";
import { UserRole } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { availableHours } from "@/utils/available-hours";

class AdminsController {
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
}

export { AdminsController }