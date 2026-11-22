-- The days rolled up before guests who only load pages were counted apart
-- (20261122120000_add_guest_visit_active) still count every guest with the
-- people, scrapers too. Their page_visits are gone, but each guest's visit and
-- its pages stay for 90 days: take the guests who did nothing out of those days'
-- totals and count them as `idle`, as the roll-up does now. 2026-11-22 is the
-- first day rolled up under the new rule; only days already rolled up change.
--
-- A guest's pages all count under the language of their first page, and under
-- its source once, since only a visit's first page brings one as a rule.

CREATE TEMP TABLE idle_pages AS
SELECT g.id, g.day, g.source, g.lang, s.target AS path, COUNT(*)::int AS views
FROM guest_visits g
JOIN visit_steps s ON s.visit_id = g.id AND s.kind = 'page'
WHERE NOT g.active
  AND g.day < DATE '2026-11-22'
  AND EXISTS (SELECT 1 FROM visit_totals t WHERE t.day = g.day AND t.dimension = 'all')
GROUP BY g.id, g.day, g.source, g.lang, s.target;

CREATE TEMP TABLE idle_totals AS
SELECT day, 'all' AS dimension, '' AS key,
  COUNT(DISTINCT id)::int AS visitors, SUM(views)::int AS views
FROM idle_pages GROUP BY day
UNION ALL
SELECT day, 'page', path, COUNT(DISTINCT id)::int, SUM(views)::int
FROM idle_pages GROUP BY day, path
UNION ALL
SELECT day, 'auth', 'guest', COUNT(DISTINCT id)::int, SUM(views)::int
FROM idle_pages GROUP BY day
UNION ALL
SELECT day, 'lang', lang, COUNT(DISTINCT id)::int, SUM(views)::int
FROM idle_pages GROUP BY day, lang
UNION ALL
SELECT day, 'source', source, COUNT(DISTINCT id)::int, COUNT(DISTINCT id)::int
FROM idle_pages WHERE source IS NOT NULL GROUP BY day, source;

UPDATE visit_totals t
SET visitors = GREATEST(t.visitors - i.visitors, 0),
    views = GREATEST(t.views - i.views, 0)
FROM idle_totals i
WHERE t.day = i.day AND t.dimension = i.dimension AND t.key = i.key;

-- A row nobody is left in, as the roll-up never writes one.
DELETE FROM visit_totals
WHERE day < DATE '2026-11-22' AND dimension <> 'idle' AND visitors = 0;

INSERT INTO visit_totals (day, dimension, key, visitors, views)
SELECT day, 'idle', '', visitors, views FROM idle_totals WHERE dimension = 'all'
ON CONFLICT DO NOTHING;

DROP TABLE idle_totals;
DROP TABLE idle_pages;
