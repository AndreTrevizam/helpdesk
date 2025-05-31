import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";

// O parametro da função é um array de roles
function verifyUserAuthorization(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Caso não exista um token ou caso o user não seja da role permitida, é barrado
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("Acesso não autorizado", 401)
    }

    return next()
  }
}

export { verifyUserAuthorization }