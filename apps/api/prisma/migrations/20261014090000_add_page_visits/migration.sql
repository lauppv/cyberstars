-- CreateTable
CREATE TABLE "page_visits" (
    "id" SERIAL NOT NULL,
    "day" DATE NOT NULL,
    "visitor" CHAR(64) NOT NULL,
    "path" VARCHAR(200) NOT NULL,
    "source" VARCHAR(100),
    "signed_in" BOOLEAN NOT NULL,
    "lang" VARCHAR(2) NOT NULL,

    CONSTRAINT "page_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_salts" (
    "day" DATE NOT NULL,
    "salt" CHAR(64) NOT NULL,

    CONSTRAINT "visit_salts_pkey" PRIMARY KEY ("day")
);

-- CreateTable
CREATE TABLE "visit_totals" (
    "day" DATE NOT NULL,
    "dimension" VARCHAR(10) NOT NULL,
    "key" VARCHAR(200) NOT NULL,
    "visitors" INTEGER NOT NULL,
    "views" INTEGER NOT NULL,

    CONSTRAINT "visit_totals_pkey" PRIMARY KEY ("day","dimension","key")
);

-- CreateIndex
CREATE INDEX "page_visits_day_idx" ON "page_visits"("day");

