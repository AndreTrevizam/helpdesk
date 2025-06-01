import { Router } from "express";
import { ServicesController } from "@/controllers/services-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const servicesRoutes = Router()
const servicesController = new ServicesController()

servicesRoutes.use(verifyUserAuthorization(["Admin"]))
servicesRoutes.post("/", servicesController.createService)
servicesRoutes.get("/", servicesController.indexServices)
servicesRoutes.patch("/:id", servicesController.changeStatus)

export { servicesRoutes }