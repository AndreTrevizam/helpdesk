/*
  Warnings:

  - You are about to drop the column `call_id` on the `services` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_call_id_fkey";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "call_id";

-- CreateTable
CREATE TABLE "call_services" (
    "id" TEXT NOT NULL,
    "call_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,

    CONSTRAINT "call_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "call_services_call_id_service_id_key" ON "call_services"("call_id", "service_id");

-- AddForeignKey
ALTER TABLE "call_services" ADD CONSTRAINT "call_services_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "calls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_services" ADD CONSTRAINT "call_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
