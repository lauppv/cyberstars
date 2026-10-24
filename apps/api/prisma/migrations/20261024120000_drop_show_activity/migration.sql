-- The activity heatmap is now shown to its owner only, so the switch that
-- showed it to others is gone.
ALTER TABLE "users" DROP COLUMN "show_activity";
