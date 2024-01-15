-- CreateTable
CREATE TABLE "goals" (
    "id" TEXT NOT NULL,
    "goal" INTEGER NOT NULL,
    "accomplished" INTEGER NOT NULL,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Data" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "dataResponseId" TEXT NOT NULL,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColorScheme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "dataResponseId" TEXT NOT NULL,

    CONSTRAINT "ColorScheme_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Data" ADD CONSTRAINT "Data_dataResponseId_fkey" FOREIGN KEY ("dataResponseId") REFERENCES "goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColorScheme" ADD CONSTRAINT "ColorScheme_dataResponseId_fkey" FOREIGN KEY ("dataResponseId") REFERENCES "goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
