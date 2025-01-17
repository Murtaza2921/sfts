/*
  Warnings:

  - Added the required column `bid` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `bid` DOUBLE NOT NULL;
