/*
  Warnings:

  - Added the required column `today_number` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "today_number" INTEGER NOT NULL;
