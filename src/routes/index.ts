import { Router } from "express";
import { userRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";

const routes = Router()

// Rotas públicas
routes.use("/users", userRoutes)
routes.use("/sessions", sessionsRoutes)

export { routes }