/*
  Warnings:

  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customerdetails` MODIFY `address` VARCHAR(191) NULL,
    MODIFY `category` VARCHAR(191) NULL,
    MODIFY `district` VARCHAR(191) NULL,
    MODIFY `option` VARCHAR(191) NULL,
    MODIFY `province` VARCHAR(191) NULL,
    MODIFY `reason` VARCHAR(191) NULL,
    MODIFY `regency` VARCHAR(191) NULL,
    MODIFY `village` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
