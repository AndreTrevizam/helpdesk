import { ErrorRequestHandler } from "express";
import { AppError } from "@/utils/AppError";
import { ZodError } from "zod";

export const errorHandling: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message })
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json({ message: "Erro de validação!", issues: error.format() })
    return
  }

  res.status(500).json({ message: error.message })

  return
}
