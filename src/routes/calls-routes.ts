import { Router } from "express";
import { CallsController } from "@/controllers/calls-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const callsRoutes = Router()
const callsController = new CallsController()

callsRoutes.use(verifyUserAuthorization(["Client"]))
callsRoutes.post("/", callsController.create)
callsRoutes.get("/", callsController.index)

export { callsRoutes }