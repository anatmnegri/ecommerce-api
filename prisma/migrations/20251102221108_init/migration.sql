/*
  Warnings:

  - You are about to drop the column `cpfCnpj` on the `Customer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[document]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `document` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Customer_cpfCnpj_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "cpfCnpj",
ADD COLUMN     "document" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_document_key" ON "Customer"("document");
