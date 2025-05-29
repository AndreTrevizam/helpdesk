-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Technician', 'Client');

-- CreateEnum
CREATE TYPE "EnumService" AS ENUM ('InstalacaoSoftwares', 'InstalacaoHardwares', 'DiagnosticoVirus', 'SuporteImpressoras', 'SuportePerifericos', 'SolucaoInternet', 'Backup', 'OtimizacaoSistemaOperacional', 'ConfiguracaoVPN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Open', 'InService', 'Closed');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "filename" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'Client',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technicians" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "technicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "available_times" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "technician_id" TEXT NOT NULL,

    CONSTRAINT "available_times_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calls" (
    "id" TEXT NOT NULL,
    "services" "EnumService"[],
    "status" "Status" NOT NULL DEFAULT 'Open',
    "user_id" TEXT NOT NULL,
    "technician_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "technicians_user_id_key" ON "technicians"("user_id");

-- AddForeignKey
ALTER TABLE "technicians" ADD CONSTRAINT "technicians_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "available_times" ADD CONSTRAINT "available_times_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "technicians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "technicians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
