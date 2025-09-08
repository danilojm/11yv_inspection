-- CreateTable
CREATE TABLE "public"."Inspection" (
    "id" TEXT NOT NULL,
    "completedBy" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "supervisor" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "room" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "generalSafety" JSONB NOT NULL,
    "fireSafety" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);
