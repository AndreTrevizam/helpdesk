import { Router } from "express";
import { AdminsController } from "@/controllers/admins-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const adminsRoutes = Router()
const adminsController = new AdminsController()

adminsRoutes.use(verifyUserAuthorization(["Admin"]))
adminsRoutes.patch("/:userId", adminsController.update)
adminsRoutes.get("/", adminsController.indexClients)

export { adminsRoutes }