import { Router } from "express";
import { userRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { techniciansRoutes } from "./technicians-routes";
import { servicesRoutes } from "./services-routes";
import { adminsRoutes } from "./admin-routes";

const routes = Router()

// Rotas públicas
routes.use("/users", userRoutes)
routes.use("/sessions", sessionsRoutes)

// Rotas privadas
routes.use(ensureAuthenticated)
routes.use("/technicians", techniciansRoutes)
routes.use("/services", servicesRoutes)
routes.use("/admin", adminsRoutes)

export { routes }