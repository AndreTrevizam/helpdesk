import { Router } from "express";
import { userRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { adminRoutes } from "./admin-routes";

const routes = Router()

// Rotas públicas
routes.use("/users", userRoutes)
routes.use("/sessions", sessionsRoutes)

// Rotas privadas
routes.use(ensureAuthenticated)
routes.use("/admin", adminRoutes)

export { routes }