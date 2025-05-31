import { Request, Response } from "express";
import { CreateUserService } from "@/services/createUserService";

class UsersControllers {
  async create(req: Request, res: Response) {
    const createUserService = new CreateUserService()
    await createUserService.createUser(req, res)

    res.status(201).json()
  }
}

export { UsersControllers }