import request from "supertest"
import { app } from "@/app"
import { prisma } from "@/database/prisma"
import { number } from "zod/v4"

describe("Services Controller", () => {
  let service_id: string
  let token: string

  beforeAll(async () => {
    const adminResponse = await request(app).post("/users").send({
      name: "Admin Teste",
      email: "admin@test.com",
      password: "admin123",
      role: "Admin"
    })

    const loginResponse = await request(app).post("/sessions").send({
      email: "admin@test.com",
      password: "admin123"
    });

    token = loginResponse.body.token
  })

  it("Should create a service successfully", async () => {
    const response = await request(app)
      .post("/services")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Service Test",
        amount: 14550
      })

    service_id = response.body.id

    expect(response.status).toBe(201)
    expect(response.body.name).toBe("Service Test")
  })

  it("Should list all services", async () => {
    const response = await request(app).get("/services").set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.services).toBeInstanceOf(Array)
    expect(response.body.pagination).toMatchObject({
      page: 1,
      perPage: 5,
      totalRecords: expect.any(Number),
      totalPages: expect.any(Number),
    })
  })

  it("Should update the status to Inactive or Active", async () => {
    const existingService = await prisma.service.findFirst({
      where: { id: "481459fe-3397-4524-8a67-f01a49da1dff" }
    })

    expect(existingService).not.toBeNull()

    const previousStatus = existingService?.status

    const response = await request(app)
      .patch(`/services/${existingService?.id}`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.status).not.toBe(previousStatus)
    expect(["Active", "Inactive"]).toContain(response.body.status)
  })

  afterAll(async () => {
    await prisma.service.delete({ where: { id: service_id } })
    await prisma.user.delete({ where: { email: "admin@test.com" } })
    await prisma.$disconnect()
  })
})