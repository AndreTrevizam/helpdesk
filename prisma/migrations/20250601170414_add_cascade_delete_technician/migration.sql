-- DropForeignKey
ALTER TABLE "technicians" DROP CONSTRAINT "technicians_user_id_fkey";

-- AddForeignKey
ALTER TABLE "technicians" ADD CONSTRAINT "technicians_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
