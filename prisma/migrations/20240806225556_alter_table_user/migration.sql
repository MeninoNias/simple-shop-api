-- AlterTable
ALTER TABLE "Pedido" ALTER COLUMN "status" SET DEFAULT 'EM_PREPARACAO';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailConfirm" BOOLEAN NOT NULL DEFAULT false;
