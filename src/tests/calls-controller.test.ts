import request from "supertest"
import { app } from "@/app"
import { prisma } from "@/database/prisma"

describe("Calls Controller", () => {
    let client_token: string
    let admin_token: string
    let call_id: string
    let service_ids: string[] = []
    let service_id: string
    let users_ids: string[] = []
    let tech_ids: string[] = []

    beforeAll(async () => {
        const admin = await request(app).post("/users").send({
            name: "ADMIN TESTE",
            email: "admintest@test.com",
            password: "123456",
            role: "Admin"
        })

        users_ids.push(admin.body.id)

        const client = await request(app).post("/users").send({
            name: "Cliente Teste",
            email: "client@test.com",
            password: "123456",
        })

        users_ids.push(client.body.id)

        const clientResponse = await request(app).post("/sessions").send({
            email: "client@test.com",
            password: "123456"
        });

        const adminResponse = await request(app).post("/sessions").send({
            email: "admintest@test.com",
            password: "123456"
        });

        client_token = clientResponse.body.token
        admin_token = adminResponse.body.token

        const service = await request(app)
            .post("/services")
            .set("Authorization", `Bearer ${admin_token}`)
            .send({
                name: "SERVICE TEST",
                amount: 100
            })

        service_id = service.body.id
        service_ids.push(service.body.id)

        const technicians = await request(app)
            .post("/admins")
            .set("Authorization", `Bearer ${admin_token}`)
            .send({
                name: "Technician Teste",
                email: "technician@test.com",
                password: "123456",
                availableTimes: ["10:00", "11:00"],
            })

        tech_ids.push(technicians.body.id)

        expect(service_ids).not.toBeNull()
    })

    it("Should create a new Call", async () => {

        const callResponse = await request(app)
            .post("/calls")
            .set("Authorization", `Bearer ${client_token}`)
            .send({
                title: "Call Teste",
                description: "Call Descrição",
                serviceId: service_id
            })

        call_id = callResponse.body.id

        expect(callResponse.status).toBe(200)
    })

    // TODO: index

    afterAll(async () => {
        // Limpar registros intermediários primeiro
        await prisma.callService.deleteMany({});

        // Limpar chamados
        await prisma.call.deleteMany({});

        // Limpar técnicos (relação com User)
        await prisma.technician.deleteMany({});

        // Limpar serviços
        await prisma.service.deleteMany({});

        // Limpar usuários
        await prisma.user.deleteMany({
            where: {
                email: {
                    in: [
                        "admintest@test.com",
                        "client@test.com",
                        "technician@test.com"
                    ]
                }
            }
        });

        await prisma.$disconnect();
    });
})