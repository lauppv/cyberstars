import type { ComponentType } from 'react';
import {
  AlgorithmsPicture,
  CoursesPicture,
  ForumPicture,
  GamePicture,
  LinuxPicture,
  TutorPicture,
} from './FeaturePictures';

// The parts of CyberStars the landing page shows under What's inside, in order,
// each with its picture. Messages, connections and the leaderboard stay off it.
export const FEATURES: [string, ComponentType][] = [
  ['courses', CoursesPicture],
  ['algorithms', AlgorithmsPicture],
  ['linux', LinuxPicture],
  ['forum', ForumPicture],
  ['laniakea', GamePicture],
  ['tutor', TutorPicture],
];

// The id a row is scrolled to by, from the chapters at the side of the page
export const featureId = (key: string) => `feature-${key}`;
