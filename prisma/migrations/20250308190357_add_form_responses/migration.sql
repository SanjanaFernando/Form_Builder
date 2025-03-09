-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "elements" JSONB NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);
