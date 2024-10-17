-- AlterTable
ALTER TABLE "reasons" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(0);

-- AlterTable
ALTER TABLE "tickets" ALTER COLUMN "start_time" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "end_time" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(0),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(0);

-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "processing_time" INTEGER NOT NULL,
    "start_work" TEXT NOT NULL,
    "end_work" TEXT NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
