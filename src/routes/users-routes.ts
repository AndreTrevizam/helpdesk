import { Router } from "express";
import { UsersControllers } from "@/controllers/users-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const usersController = new UsersControllers()
const userRoutes = Router()

userRoutes.post("/", usersController.create)

userRoutes.get("/",
  ensureAuthenticated,
  verifyUserAuthorization(["Admin"]),
  usersController.index
)
userRoutes.patch("/:userId",
  ensureAuthenticated,
  verifyUserAuthorization(["Admin"]),
  usersController.update
)
userRoutes.delete("/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["Admin"]),
  usersController.remove
)

export { userRoutes }