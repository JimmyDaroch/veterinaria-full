/*
  Warnings:

  - You are about to drop the column `fechaNac` on the `Mascota` table. All the data in the column will be lost.
  - You are about to drop the column `observaciones` on the `Mascota` table. All the data in the column will be lost.
  - You are about to drop the column `peso` on the `Mascota` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mascota" DROP CONSTRAINT "Mascota_clienteId_fkey";

-- AlterTable
ALTER TABLE "Mascota" DROP COLUMN "fechaNac",
DROP COLUMN "observaciones",
DROP COLUMN "peso",
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "edad" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
