import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Feed } from './feed';
import { headingOf, mapPoint, type ShipPose } from './navMath';
import type { PlanetSpot } from './planetLayout';
import type { PlanetMark } from './scene/planets';
import { MARK_COLOR } from './colors';

const SIZE = 180;
const RANGE = 9000;

// The map in the corner, seen from above with the ship in the middle and its
// nose up: the student's planets in blue, the rest neutral, the target ringed.
// It draws straight from the ship's pose, without rendering the page.
export function StarMap({
  pose,
  spots,
  marks,
  target,
}: {
  pose: Feed<ShipPose | null>;
  spots: PlanetSpot[];
  marks: Record<string, PlanetMark>;
  target: string | null;
}) {
  const { t } = useTranslation();
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw = () => {
      const el = canvas.current;
      const ctx = el?.getContext('2d');
      const ship = pose.get();
      if (!el || !ctx || !ship) return;
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      if (el.width !== SIZE * ratio) {
        el.width = SIZE * ratio;
        el.height = SIZE * ratio;
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.strokeStyle = 'rgba(108, 92, 231, 0.25)';
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 1, 0, Math.PI * 2);
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 4, 0, Math.PI * 2);
      ctx.stroke();

      const heading = headingOf(ship);
      for (const spot of spots) {
        const p = mapPoint(ship, heading, spot.position, RANGE, SIZE - 8);
        const x = p.x + 4;
        const y = p.y + 4;
        const mark = marks[spot.slug] ?? 'none';
        ctx.fillStyle = MARK_COLOR[mark];
        ctx.globalAlpha = p.outside ? 0.45 : 1;
        ctx.beginPath();
        ctx.arc(x, y, mark === 'none' ? 2 : 3, 0, Math.PI * 2);
        ctx.fill();
        if (spot.slug === target) {
          ctx.globalAlpha = 1;
          ctx.strokeStyle = '#a79bff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }
      ctx.globalAlpha = 1;
      // the ship, nose up
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(SIZE / 2, SIZE / 2 - 6);
      ctx.lineTo(SIZE / 2 + 4, SIZE / 2 + 4);
      ctx.lineTo(SIZE / 2 - 4, SIZE / 2 + 4);
      ctx.closePath();
      ctx.fill();
    };
    draw();
    return pose.subscribe(draw);
  }, [pose, spots, marks, target]);

  return (
    <div className="lnk-hud lnk-panel lnk-map lnk-bottom-right !p-2">
      <canvas ref={canvas} role="img" aria-label={t('laniakea.hud.map')} />
    </div>
  );
}
