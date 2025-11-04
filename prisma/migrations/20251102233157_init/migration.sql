/*
  Warnings:

  - You are about to drop the column `totalCents` on the `Order` table. All the data in the column will be lost.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "totalCents",
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;
