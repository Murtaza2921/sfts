/*
  Warnings:

  - Added the required column `destinationLat` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationLng` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromLat` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromLng` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event` ADD COLUMN `destinationLat` DOUBLE NOT NULL,
    ADD COLUMN `destinationLng` DOUBLE NOT NULL,
    ADD COLUMN `fromLat` DOUBLE NOT NULL,
    ADD COLUMN `fromLng` DOUBLE NOT NULL;
