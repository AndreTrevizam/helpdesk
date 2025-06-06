import { Router } from "express";
import { UploadsController } from "@/controllers/uploads-controller";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import multer from "multer";
import uploadConfig from "@/configs/upload";

const uploadsRoutes = Router()
const uploadsController = new UploadsController()


const upload = multer(uploadConfig.MULTER)

uploadsRoutes.use(verifyUserAuthorization(["Admin", "Client", "Technician"]))

// "file" é o campo que vamos enviar o arquivo
uploadsRoutes.post("/", upload.single("file"), uploadsController.create)

export { uploadsRoutes }