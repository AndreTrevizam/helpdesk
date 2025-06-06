import fs from "node:fs"
import path from "node:path"

import uploadConfig from "@/configs/upload"

class DiskStorage {
  async saveFile(file: string) {
    // pega o arquivo dentro da pasta temporaria 
    const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, file)

    // destino do arquivo
    const destPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

    try {
      // tenta acessar o arquivo que esta na pasta temporaria
      await fs.promises.access(tmpPath)
    } catch (error) {
      console.log(error)
      throw new Error(`Arquivo não encontrado: ${tmpPath}`)
    }

    // garantir que a pasta de uploads exista
    await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, { recursive: true })

    // manda o arquivo para a pasta destino
    await fs.promises.rename(tmpPath, destPath)

    return file
  }

  async deleteFile(file: string, type: "tmp" | "upload") {
    const pathFile =
      type === "tmp" ? uploadConfig.TMP_FOLDER : uploadConfig.UPLOADS_FOLDER

    const filePath = path.resolve(pathFile, file)

    try {
      // verifica se o arquivo esta disponivel
      await fs.promises.stat(filePath)
    } catch {
      return 
    }

    // deleta o arquivo
    await fs.promises.unlink(filePath)
  }
}

export { DiskStorage }