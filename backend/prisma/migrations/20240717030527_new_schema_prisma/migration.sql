/*
  Warnings:

  - You are about to drop the column `nama` on the `admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Admin_nama_key` ON `admin`;

-- AlterTable
ALTER TABLE `admin` DROP COLUMN `nama`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Pages` (
    `id` VARCHAR(191) NOT NULL,
    `page` VARCHAR(191) NOT NULL,
    `data` JSON NOT NULL,

    UNIQUE INDEX `Pages_page_key`(`page`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_username_key` ON `Admin`(`username`);
