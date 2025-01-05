-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `notificationToken` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `ratings` DOUBLE NOT NULL DEFAULT 0,
    `totalRides` DOUBLE NOT NULL DEFAULT 0,
    `cratedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_phone_number_key`(`phone_number`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `driver` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `vehicle_type` ENUM('Car', 'Motorcycle', 'CNG') NOT NULL,
    `registration_number` VARCHAR(191) NOT NULL,
    `registration_date` VARCHAR(191) NOT NULL,
    `driving_license` VARCHAR(191) NOT NULL,
    `vehicle_color` VARCHAR(191) NULL,
    `rate` VARCHAR(191) NOT NULL,
    `notificationToken` VARCHAR(191) NULL,
    `ratings` DOUBLE NOT NULL DEFAULT 0,
    `totalEarning` DOUBLE NOT NULL DEFAULT 0,
    `totalRides` DOUBLE NOT NULL DEFAULT 0,
    `pendingRides` DOUBLE NOT NULL DEFAULT 0,
    `cancelRides` DOUBLE NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'inactive',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `driver_phone_number_key`(`phone_number`),
    UNIQUE INDEX `driver_email_key`(`email`),
    UNIQUE INDEX `driver_registration_number_key`(`registration_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rides` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `driverId` INTEGER NOT NULL,
    `charge` DOUBLE NOT NULL,
    `currentLocationName` VARCHAR(191) NOT NULL,
    `destinationLocationName` VARCHAR(191) NOT NULL,
    `distance` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NULL,
    `cratedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rides` ADD CONSTRAINT `rides_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rides` ADD CONSTRAINT `rides_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `driver`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
