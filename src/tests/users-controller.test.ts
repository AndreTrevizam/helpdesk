import request from "supertest"
import { app } from "@/app"
import { prisma } from "@/database/prisma"

describe("Users Controller", () => {

    let user_id: string
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

    it("Should create a new user", async () => {
        const response = await request(app).post("/users").send({
            name: "Test User",
            email: "test@test.com",
            password: "testpassword"
        })

        user_id = response.body.id

        expect(response.status).toBe(201)
        expect(response.body.email).toBe("test@test.com")
    })

    it("Should list all users (ADMIN ONLY)", async () => {
        const response = await request(app)
            .get("/users")
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.users).toBeInstanceOf(Array)
        expect(response.body.pagination).toMatchObject({
            page: 1,
            perPage: 5,
            totalRecords: expect.any(Number),
            totalPages: expect.any(Number),
        })
    })

    it("Should update name and email of a user (ADMIN ONLY)", async() => {
        const user = await prisma.user.findFirst({ where: { id: user_id}})

        expect(user).not.toBeNull()

        let userId = user?.id

        const response = await request(app)
            .patch(`/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Patched User",
                email: "userpatch@user.com"
            })

        // TODO
        expect(response).toBe()
    })

    afterAll(async () => {
        await prisma.user.delete({ where: { id: user_id } })
        await prisma.$disconnect
    })
})