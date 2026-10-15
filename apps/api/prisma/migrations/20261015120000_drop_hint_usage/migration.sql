-- AI hints are gone, so their usage counters have nothing left to cap.

DELETE FROM "usage_windows" WHERE "action" = 'getHint';
