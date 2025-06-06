import { prisma } from "@/database/prisma"

export async function cleanDatabase() {
  await prisma.call.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.callService.deleteMany()
  await prisma.technician.deleteMany()
}