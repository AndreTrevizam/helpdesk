import { Router } from "express";
import { userRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { techniciansRoutes } from "./technicians-routes";
import { servicesRoutes } from "./services-routes";
import { callsRoutes } from "./calls-routes";
import { clientsRoutes } from "./clients-routes";
import { adminsRoutes } from "./admins-routes";
import { callStatusRoutes } from "./call-status";

const routes = Router()

// Rotas públicas
routes.use("/users", userRoutes)
routes.use("/sessions", sessionsRoutes)

// Rotas privadas
routes.use(ensureAuthenticated)
routes.use("/technicians", techniciansRoutes)
routes.use("/services", servicesRoutes)
routes.use("/calls", callsRoutes)
routes.use("/clients", clientsRoutes)
routes.use("/admins", adminsRoutes)
routes.use("/call-status", callStatusRoutes)

export { routes }