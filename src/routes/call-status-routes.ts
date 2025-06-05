import { Router } from "express"
import { CallStatusController } from "@/controllers/call-status-controller"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"

const callStatusRoutes = Router()
const callStatusController = new CallStatusController()

callStatusRoutes.use(verifyUserAuthorization(["Technician"]))
callStatusRoutes.patch("/:callId", callStatusController.update)

export { callStatusRoutes }