-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'CONNECTION_REQUEST';
ALTER TYPE "NotificationType" ADD VALUE 'CONNECTION_ACCEPTED';

-- AlterTable
ALTER TABLE "users"
  ADD COLUMN "show_connections" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "connections" (
    "id" SERIAL NOT NULL,
    "requester_id" INTEGER NOT NULL,
    "addressee_id" INTEGER NOT NULL,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),

    CONSTRAINT "connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "connections_addressee_id_status_idx" ON "connections"("addressee_id", "status");

-- CreateIndex
CREATE INDEX "connections_requester_id_status_idx" ON "connections"("requester_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "connections_requester_id_addressee_id_key" ON "connections"("requester_id", "addressee_id");

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_addressee_id_fkey" FOREIGN KEY ("addressee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
