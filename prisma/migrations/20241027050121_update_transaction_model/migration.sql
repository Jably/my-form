/*
  Warnings:

  - You are about to drop the column `transactionId` on the `customerdetails` table. All the data in the column will be lost.
  - Added the required column `customerDetailsId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `customerdetails` DROP FOREIGN KEY `CustomerDetails_transactionId_fkey`;

-- AlterTable
ALTER TABLE `customerdetails` DROP COLUMN `transactionId`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `category` VARCHAR(191) NULL,
    ADD COLUMN `district` VARCHAR(191) NULL,
    ADD COLUMN `option` VARCHAR(191) NULL,
    ADD COLUMN `province` VARCHAR(191) NULL,
    ADD COLUMN `reason` VARCHAR(191) NULL,
    ADD COLUMN `regency` VARCHAR(191) NULL,
    ADD COLUMN `village` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `customerDetailsId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_customerDetailsId_fkey` FOREIGN KEY (`customerDetailsId`) REFERENCES `CustomerDetails`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
