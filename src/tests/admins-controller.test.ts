import request from "supertest"
import { app } from "@/app"
import { cleanDatabase } from "./setup"

describe("Admins Controller", () => {
  let admin_token: string

  beforeAll(async () => {
    const admin = await request(app).post("/users").send({
      name: "admin test",
      email: "test@admin.com",
      password: "123456",
      role: "Admin"
    })

    const adminResponse = await request(app).post("/sessions").send({
      email: "test@admin.com",
      password: "123456"
    })

    admin_token = adminResponse.body.token
    console.log(admin_token)
  })

  it("Should create a new Technician", async () => {
    const response = await request(app)
      .post("/admins")
      .set("Authorization", `Bearer ${admin_token}`)
      .send({
        name: "Technician Teste",
        email: "technician@test.com",
        password: "123456",
        availableTimes: ["10:00", "11:00"],
      })

    console.log(response.status)
    console.log(response.text)
    expect(response.status).toBe(201)
  })

  it("Should list all Technicians", async () => {
    const response = await request(app).get("/admins").set("Authorization", `Bearer ${admin_token}`)

    expect(response.status).toBe(200)
    expect(response.body.technicians).toBeInstanceOf(Array)
    expect(response.body.pagination).toMatchObject({
      page: 1,
      perPage: 5,
      totalRecords: expect.any(Number),
      totalPages: expect.any(Number),
    })
  })

  afterAll(async () => {
    await cleanDatabase()
  })
})