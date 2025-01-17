/*
  Warnings:

  - Added the required column `noOfDays` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `noOfDays` INTEGER NOT NULL;
