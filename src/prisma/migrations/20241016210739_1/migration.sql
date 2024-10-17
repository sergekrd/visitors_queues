-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_end_reason_id_fkey";

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "end_reason_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_end_reason_id_fkey" FOREIGN KEY ("end_reason_id") REFERENCES "reasons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
