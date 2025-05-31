import { Router } from "express";
import { AdminsController } from "@/controllers/admins-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const adminRoutes = Router()
const adminsController = new AdminsController()

adminRoutes.use(
  "/",
  verifyUserAuthorization(["Admin"]),
  adminsController.create
)

export { adminRoutes }