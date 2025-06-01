/*
  Warnings:

  - You are about to drop the column `services` on the `calls` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('Active', 'Inactive');

-- AlterTable
ALTER TABLE "calls" DROP COLUMN "services";

-- DropEnum
DROP TYPE "EnumService";

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'Active',
    "call_id" TEXT NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "calls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
