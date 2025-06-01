import { Router } from "express";
import { TechniciansController } from "@/controllers/technicians-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const techniciansRoutes = Router()
const techniciansController = new TechniciansController()

techniciansRoutes.use(verifyUserAuthorization(["Admin"]))
techniciansRoutes.post("/", techniciansController.createTechnician)
techniciansRoutes.get("/", techniciansController.indexTechnicians)

export { techniciansRoutes }