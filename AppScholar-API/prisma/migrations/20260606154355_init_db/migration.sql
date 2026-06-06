/*
  Warnings:

  - You are about to drop the column `studentId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `degree` on the `professors` table. All the data in the column will be lost.
  - You are about to drop the column `field` on the `professors` table. All the data in the column will be lost.
  - You are about to drop the column `teachingExperience` on the `professors` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `professors` table. All the data in the column will be lost.
  - You are about to drop the column `course` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `professorId` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `program` on the `subjects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id,subject_id]` on the table `grades` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `professors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `student_id` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_id` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `degree_id` to the `professors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `field_id` to the `professors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teaching_experience` to the `professors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `professors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `professors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_id` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professor_id` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CoursePeriod" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'FULL_TIME');

-- AlterEnum
ALTER TYPE "Situation" ADD VALUE 'PENDING';

-- DropForeignKey
ALTER TABLE "grades" DROP CONSTRAINT "grades_studentId_fkey";

-- DropForeignKey
ALTER TABLE "grades" DROP CONSTRAINT "grades_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "professors" DROP CONSTRAINT "professors_userId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_userId_fkey";

-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_professorId_fkey";

-- DropIndex
DROP INDEX "professors_userId_key";

-- DropIndex
DROP INDEX "students_userId_key";

-- AlterTable
ALTER TABLE "grades" DROP COLUMN "studentId",
DROP COLUMN "subjectId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "student_id" INTEGER NOT NULL,
ADD COLUMN     "subject_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "grade2" DROP NOT NULL,
ALTER COLUMN "average" DROP NOT NULL,
ALTER COLUMN "situation" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "professors" DROP COLUMN "degree",
DROP COLUMN "field",
DROP COLUMN "teachingExperience",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "degree_id" INTEGER NOT NULL,
ADD COLUMN     "field_id" INTEGER NOT NULL,
ADD COLUMN     "teaching_experience" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "course",
DROP COLUMN "userId",
DROP COLUMN "zipCode",
ADD COLUMN     "course_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD COLUMN     "zip_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "professorId",
DROP COLUMN "program",
ADD COLUMN     "course_id" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "professor_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "course_period" "CoursePeriod" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "degrees" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "degrees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_invitations" (
    "id" SERIAL NOT NULL,
    "enrollment" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "course_id" INTEGER NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_name_key" ON "courses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "degrees_name_key" ON "degrees"("name");

-- CreateIndex
CREATE UNIQUE INDEX "fields_name_key" ON "fields"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_invitations_enrollment_key" ON "user_invitations"("enrollment");

-- CreateIndex
CREATE UNIQUE INDEX "user_invitations_email_key" ON "user_invitations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "grades_student_id_subject_id_key" ON "grades"("student_id", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "professors_user_id_key" ON "professors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_degree_id_fkey" FOREIGN KEY ("degree_id") REFERENCES "degrees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professors" ADD CONSTRAINT "professors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grades" ADD CONSTRAINT "grades_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_invitations" ADD CONSTRAINT "user_invitations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
