/*
  Warnings:

  - You are about to alter the column `carType` on the `sharedride` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `sharedride` MODIFY `carType` VARCHAR(191) NOT NULL;
