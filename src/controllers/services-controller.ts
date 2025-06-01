import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class ServicesController {
  async createService(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1, { message: "De um nome para o serviço" }),
      amount: z.coerce.number()
    })

    const { name, amount } = bodySchema.parse(req.body)

    const service = await prisma.service.create({
      data: {
        name,
        amount
      }
    })

    res.status(201).json(service)
  }

  async indexServices(req: Request, res: Response) {
    const querySchema = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(5)
    })

    const { name, page, perPage } = querySchema.parse(req.query)

    const skip = (page - 1) * perPage

    const services = await prisma.service.findMany({
      skip,
      take: perPage,
      where: {
        name: {
          contains: name.trim()
        }
      }
    })

    const totalRecords = await prisma.service.count({
      where: {
        name: {
          contains: name.trim()
        }
      }
    })

    const totalPages = Math.ceil(totalRecords / perPage)

    res.json({
      services,
      pagination: {
        page,
        perPage,
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1
      }
    })
  }

  async changeStatus(req: Request, res: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = paramsSchema.parse(req.params)

    if (!id) {
      throw new AppError("Esse serviço não existe")
    }

    const service = await prisma.service.findFirst({
      where: { id }
    })

    if (service?.status == "Active") {
      await prisma.service.update({
        where: { id },
        data: {
          status: 'Inactive'
        }
      })
    } else {
      await prisma.service.update({
        where: { id },
        data: {
          status: 'Active'
        }
      })
    }

    res.json()
  }
}

export { ServicesController }