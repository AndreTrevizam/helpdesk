import request from "supertest"
import { app } from "@/app"
import { prisma } from "@/database/prisma"
import { response } from "express"
import { string } from "zod/v4"

describe("Sessions Controller", () => {
  let user_id: string

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } })
  })

  it("Should authenticate and get access token", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Test user",
      email: "test@test.com",
      password: "testtest",
    })

    user_id = userResponse.body.id

    const sessionResponse = await request(app).post("/sessions").send({
      email: "test@test.com",
      password: "testtest",
    })

    expect(sessionResponse.status).toBe(200)
    expect(sessionResponse.body.token).toEqual(expect.any(String))
  })
})