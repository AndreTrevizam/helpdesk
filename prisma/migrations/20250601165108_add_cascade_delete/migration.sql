-- DropForeignKey
ALTER TABLE "calls" DROP CONSTRAINT "calls_technician_id_fkey";

-- DropForeignKey
ALTER TABLE "calls" DROP CONSTRAINT "calls_user_id_fkey";

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "calls_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "technicians"("id") ON DELETE CASCADE ON UPDATE CASCADE;
