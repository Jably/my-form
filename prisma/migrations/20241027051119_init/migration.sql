/*
  Warnings:

  - You are about to drop the column `createdAt` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `transaction` table. All the data in the column will be lost.
  - Made the column `address` on table `customerdetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `customerdetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district` on table `customerdetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `option` on table `customerdetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `province` on table `customerdetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reason` on table `customerdetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `regency` on table `customerdetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `village` on table `customerdetails` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `customerdetails` MODIFY `address` VARCHAR(191) NOT NULL,
    MODIFY `category` VARCHAR(191) NOT NULL,
    MODIFY `district` VARCHAR(191) NOT NULL,
    MODIFY `option` VARCHAR(191) NOT NULL,
    MODIFY `province` VARCHAR(191) NOT NULL,
    MODIFY `reason` VARCHAR(191) NOT NULL,
    MODIFY `regency` VARCHAR(191) NOT NULL,
    MODIFY `village` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;
