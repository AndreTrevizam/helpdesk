import { Router } from "express";
import { TechniciansController } from "@/controllers/technicians-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const techniciansRoutes = Router()
const techniciansController = new TechniciansController()


techniciansRoutes.use(verifyUserAuthorization(["Technician"]))
techniciansRoutes.get("/", techniciansController.show)
techniciansRoutes.patch("/:callId", techniciansController.update)

export { techniciansRoutes }