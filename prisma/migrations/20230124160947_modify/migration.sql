/*
  Warnings:

  - Added the required column `acceptance` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `executed` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "acceptance" BOOLEAN NOT NULL,
ADD COLUMN     "executed" BOOLEAN NOT NULL,
ADD COLUMN     "meetingTime" TIMESTAMP(3);
