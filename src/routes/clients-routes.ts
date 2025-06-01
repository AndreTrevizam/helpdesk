import { Router } from "express";
import { ClientsController } from "@/controllers/clients-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const clientsRoutes = Router()
const clientsController = new ClientsController()

clientsRoutes.use(verifyUserAuthorization(["Client"]))
clientsRoutes.delete("/", clientsController.remove)
clientsRoutes.patch("/", clientsController.update)

export { clientsRoutes }