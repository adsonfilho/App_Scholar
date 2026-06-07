/*
  Warnings:

  - A unique constraint covering the columns `[acronym]` on the table `courses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `acronym` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "acronym" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "courses_acronym_key" ON "courses"("acronym");
