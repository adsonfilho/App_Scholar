/*
  Warnings:

  - Added the required column `neighborhood` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "neighborhood" TEXT NOT NULL;
