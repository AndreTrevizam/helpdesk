-- DropForeignKey
ALTER TABLE "call_services" DROP CONSTRAINT "call_services_call_id_fkey";

-- DropForeignKey
ALTER TABLE "call_services" DROP CONSTRAINT "call_services_service_id_fkey";

-- AddForeignKey
ALTER TABLE "call_services" ADD CONSTRAINT "call_services_call_id_fkey" FOREIGN KEY ("call_id") REFERENCES "calls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_services" ADD CONSTRAINT "call_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
