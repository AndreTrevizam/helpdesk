/*
  Warnings:

  - You are about to drop the `available_times` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "available_times" DROP CONSTRAINT "available_times_technician_id_fkey";

-- AlterTable
ALTER TABLE "technicians" ADD COLUMN     "availableTimes" TEXT[];

-- DropTable
DROP TABLE "available_times";
