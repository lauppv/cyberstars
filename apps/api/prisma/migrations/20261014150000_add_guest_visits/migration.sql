-- CreateTable
CREATE TABLE "guest_visits" (
    "id" SERIAL NOT NULL,
    "day" DATE NOT NULL,
    "visitor" CHAR(64),
    "source" VARCHAR(100),
    "lang" VARCHAR(2) NOT NULL,

    CONSTRAINT "guest_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_steps" (
    "id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "kind" VARCHAR(6) NOT NULL,
    "target" VARCHAR(200) NOT NULL,

    CONSTRAINT "visit_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guest_visits_day_visitor_key" ON "guest_visits"("day", "visitor");

-- CreateIndex
CREATE INDEX "visit_steps_visit_id_idx" ON "visit_steps"("visit_id");

-- AddForeignKey
ALTER TABLE "visit_steps" ADD CONSTRAINT "visit_steps_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "guest_visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

