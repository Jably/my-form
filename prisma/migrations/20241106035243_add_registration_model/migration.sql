/*
  Warnings:

  - You are about to drop the column `createdAt` on the `registration` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `registration` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Registration_orderId_key` ON `registration`;

-- AlterTable
ALTER TABLE `registration` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;
