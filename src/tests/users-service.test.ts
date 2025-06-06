import request from "supertest"
import { app } from "@/app"
import { cleanDatabase } from "./setup"

describe("UserService", () => {
  let user_id: string

  it("Should create a new user successfully", async () => {
    const response = await request(app).post("/users").send({
      name: "Test user",
      email: "test@test.com",
      password: "testtest",
    })

    expect(response.status).toBe(201)

    user_id = response.body.id
  })

  it("Should throw an error if user with same email already exists", async () => {
    const response = await request(app).post("/users").send({
      name: "Duplicated User",
      email: "test@test.com",
      password: "testtest",
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("E-mail já cadastrado!")

  })

  it("Should throw an error if email is invalid", async () => {
    const response = await request(app).post("/users").send({
      name: "User",
      email: "invalid-email",
      password: "testtest",
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("Erro de validação!")

  })

  afterAll(async () => {
    await cleanDatabase()
  })
})