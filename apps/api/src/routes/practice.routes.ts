import express, { Router } from 'express';
import { limiter } from '../middleware/rateLimit.js';
import {
  badBody,
  broken,
  getStarship,
  held,
  listCrew,
  listStarships,
  notFound,
  reportStarship,
} from '../controllers/practice.controller.js';

// The practice API (CYB-115): what a student's page loads with fetch in the
// Web Development course. A page in the preview has an origin of its own, so
// the API answers any origin, with no cookies and nothing else of the site:
// `app.ts` mounts it before the site's CORS and its guest cookie, and it
// reaches no other route. Its own limit: a preview loads it again after every
// change, a tracker page asks for two addresses each time, and a student who
// types without a break sends about 200 a minute, so a class behind one
// school IP still fits. Past it, the answer is JSON like every other one.
const practiceLimiter = limiter({
  windowMs: 60_000,
  limit: 1200,
  message: { error: 'Too many requests from your network. Wait a minute, then try again.' },
});

const router = Router();

router.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '600',
    'Cache-Control': 'no-store',
  });
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});
router.use(practiceLimiter);

router.get('/starships', held, listStarships);
router.get('/starships/:id', held, getStarship);
router.post('/starships', express.json({ limit: '10kb', strict: false }), reportStarship);
router.get('/crew', held, listCrew);
router.get('/broken', held, broken);
router.use(notFound);
router.use(badBody);

export default router;
