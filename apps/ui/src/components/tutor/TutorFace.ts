import { createLucideIcon, type IconNode } from 'lucide-react';

// The tutor's face: CyberStars' star, round enough to hold a face, drawn as a
// lucide icon so it can stand wherever one does

const STAR: IconNode[number] = [
  'path',
  {
    d: 'M12 2.5 15.7 7.9 21.99 9.76 17.99 14.95 18.17 21.49 12 19.3 5.83 21.49 6.01 14.95 2.01 9.76 8.3 7.9z',
    key: 'star',
  },
];

// The eyes carry a class of their own, so the tutor's mark can blink them
export const TutorFace = createLucideIcon('tutor-face', [
  STAR,
  ['path', { d: 'M9.75 12.25h.01M14.25 12.25h.01', key: 'eyes', className: 'tutor-eyes' }],
  ['path', { d: 'M9.75 15s.9 1.25 2.25 1.25 2.25-1.25 2.25-1.25', key: 'mouth' }],
]);

// Eyes turned up and a straight mouth, while an answer is on its way
export const TutorFaceThinking = createLucideIcon('tutor-face-thinking', [
  STAR,
  ['path', { d: 'M9.25 11.5h.01M13.75 11.5h.01', key: 'eyes' }],
  ['path', { d: 'M11 15.5h2.25', key: 'mouth' }],
]);

// Smiling eyes and a wide smile, when the student gets there
export const TutorFaceHappy = createLucideIcon('tutor-face-happy', [
  STAR,
  ['path', { d: 'M8.75 12.5q1-1.25 2 0M13.25 12.5q1-1.25 2 0', key: 'eyes' }],
  ['path', { d: 'M9.5 14.75s.9 1.75 2.5 1.75 2.5-1.75 2.5-1.75', key: 'mouth' }],
]);
