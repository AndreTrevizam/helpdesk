import { Router } from "express";
import { TechniciansController } from "@/controllers/technicians-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const techniciansRoutes = Router()
const techniciansController = new TechniciansController()

techniciansRoutes.get(
  "/my-calls", 
  verifyUserAuthorization(["Technician"]),
  techniciansController.show
)

techniciansRoutes.use(verifyUserAuthorization(["Admin"]))
techniciansRoutes.post("/", techniciansController.create)
techniciansRoutes.get("/", techniciansController.index)


export { techniciansRoutes }