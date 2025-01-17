-- CreateTable
CREATE TABLE `SharedRide` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `from` VARCHAR(191) NOT NULL,
    `fromLat` DOUBLE NOT NULL,
    `fromLng` DOUBLE NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `destinationLat` DOUBLE NOT NULL,
    `destinationLng` DOUBLE NOT NULL,
    `Date` DATETIME(3) NOT NULL,
    `Time` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Bid` DOUBLE NOT NULL,
    `carType` ENUM('Car', 'Motorcycle', 'CNG') NOT NULL,
    `numberOfSeats` INTEGER NOT NULL,
    `AvaliableSeats` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
