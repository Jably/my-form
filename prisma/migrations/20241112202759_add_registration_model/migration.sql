/*
  Warnings:

  - Added the required column `option` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `registration` ADD COLUMN `option` VARCHAR(191) NOT NULL;
