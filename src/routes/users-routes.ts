import { Router } from "express";
import { UsersControllers } from "@/controllers/users-controller";

const usersController = new UsersControllers()
const userRoutes = Router()

userRoutes.post("/", usersController.create)

export { userRoutes }