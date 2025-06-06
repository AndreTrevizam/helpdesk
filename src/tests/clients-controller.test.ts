import request from "supertest"
import { app } from "@/app"
import { cleanDatabase } from "./setup"

describe("Clients Controller", () => {
  let client_token: string
  let user_id: string

  beforeAll(async () => {
    const client = await request(app).post("/users").send({
      name: "client test",
      email: "client@test.com",
      password: "123456"
    })

    user_id = client.body.id

    const clientResponse = await request(app).post("/sessions").send({
      email: "client@test.com",
      password: "123456"
    })

    client_token = clientResponse.body.token
  })

  it("Should update the client password", async () => {
    const response = await request(app).patch("/clients").set("Authorization", `Bearer ${client_token}`).send({
      password: "12345678"
    })

    console.log(response.body.message)
    expect(response.status).toBe(200)
    expect(response.body.message).toBe("Senha alterada com sucesso!")
  })

  afterAll(async () => {
    await cleanDatabase()
  })
})