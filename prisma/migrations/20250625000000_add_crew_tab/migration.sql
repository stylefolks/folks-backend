-- CreateEnum
CREATE TYPE "CrewTabType" AS ENUM ('OVERVIEW','POSTS','NOTICE','EVENT','TOPIC');

-- CreateTable
CREATE TABLE "CrewTab" (
    "id" TEXT NOT NULL,
    "crewId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "CrewTabType" NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,
    "hashtag" TEXT,
    CONSTRAINT "CrewTab_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CrewTab_crewId_order_idx" ON "CrewTab"("crewId", "order");

-- AddForeignKey
ALTER TABLE "CrewTab" ADD CONSTRAINT "CrewTab_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;
