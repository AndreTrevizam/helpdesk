// Isso indica pro Express que o Request pode ter uma prop
// de user com os campos id e role

declare namespace Express {
  export interface Request {
    user?: {
      id: string
      role: string
    }
  }
}