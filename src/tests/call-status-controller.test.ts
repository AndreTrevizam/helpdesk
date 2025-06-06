import request from "supertest"
import { app } from "@/app"
import { cleanDatabase } from "./setup"

describe("Call Status Controller", () => {
    let client_token: string
    let admin_token: string
    let technician_token: string
    let service_id: string
    let call_id: string

    beforeAll(async () => {
        const admin = await request(app).post("/users").send({
            name: "ADMIN TESTE",
            email: "admintest@test.com",
            password: "123456",
            role: "Admin"
        })

        const client = await request(app).post("/users").send({
            name: "Cliente Teste",
            email: "client@test.com",
            password: "123456",
        })

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

        const technician = await request(app)
            .post("/admins")
            .set("Authorization", `Bearer ${admin_token}`)
            .send({
                name: "Technician Teste",
                email: "technician@test.com",
                password: "123456",
                availableTimes: ["10:00", "11:00"],
            })

        const technicianResponse = await request(app)
            .post("/sessions")
            .send({
                email: "technician@test.com",
                password: "123456",
            })

        technician_token = technicianResponse.body.token
        expect(service_id).not.toBeNull()

        const call = await request(app)
            .post("/calls")
            .set("Authorization", `Bearer ${client_token}`)
            .send({
                title: "call test",
                description: "call description",
                serviceId: service_id
            })

        call_id = call.body.id
    })

    it("Should update the status of the call", async () => {
        const response = await request(app)
            .patch(`/call-status/${call_id}`)
            .set("Authorization", `Bearer ${technician_token}`)
            .send({
                newStatus: "InService"
            })

        expect(response.status).toBe(200)
        expect(response.body.message).toBe("Status atualizado com sucesso!")
    })

    afterAll(async () => {
        await cleanDatabase()
    })
})