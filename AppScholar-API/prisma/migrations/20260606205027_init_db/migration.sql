-- DropForeignKey
ALTER TABLE "user_invitations" DROP CONSTRAINT "user_invitations_course_id_fkey";

-- AlterTable
ALTER TABLE "user_invitations" ALTER COLUMN "course_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user_invitations" ADD CONSTRAINT "user_invitations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
