import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Award, ChevronDown, ChevronUp, LogOut, Pause, PanelRight } from 'lucide-react';
import {
  FOREVER_LEVEL,
  planetLessons,
  type LaniakeaState,
  type QuizAnswerResult,
} from '@cyberstars/shared/laniakea';
import * as laniakeaService from '../../services/laniakeaService';
import { useCurriculum } from '../../context/CurriculumContext';
import { createFeed } from './feed';
import { LOOK_COUNT, layoutPlanets } from './planetLayout';
import { canFly, statusOf } from './planetStatus';
import { markOf } from './colors';
import { useNow } from './waitText';
import type { ShipPose } from './navMath';
import type { Aim, Explorer } from './scene/explorer';
import type { PlanetMark } from './scene/planets';
import { loadThree } from './scene/loadThree';
import { AimCard } from './AimCard';
import { ShipBoard } from './ShipBoard';
import { StarMap } from './StarMap';
import { TargetReadout } from './TargetReadout';
import { ShipStats, SpeedPanel } from './ShipStats';
import { QuizDialog } from './QuizDialog';
import { IntroScreen, LeaveScreen, LoadingScreen, LockedScreen, PauseScreen } from './Screens';
import './laniakea.css';

// A phone or a tablet, whose main pointer is a finger: it flies with the stick
// and the throttle buttons. A laptop with a touch screen still has its keys.
function touchScreen(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)').matches;
}

const sameAim = (a: Aim | null, b: Aim | null) =>
  a === b ||
  (!!a &&
    !!b &&
    a.slug === b.slug &&
    a.inReach === b.inReach &&
    Math.round(a.distance / 10) === Math.round(b.distance / 10));

// Laniakea, the explorer game: every Python lesson the student finished is a
// planet to fly to and conquer with a test on its lesson. The page holds the
// game's state and the overlays; the 3D scene loads on its own and reports the
// ship's pose and what it aims at through feeds.
export function LaniakeaPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { courses } = useCurriculum();
  const lang = i18n.language === 'ro' ? 'ro' : 'en';
  const [isTouch] = useState(touchScreen);

  const [state, setState] = useState<LaniakeaState | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [offset, setOffset] = useState(0);
  const load = useCallback(() => {
    return laniakeaService
      .getLaniakea()
      .then((s) => {
        setState(s);
        setOffset(Date.parse(s.serverNow) - Date.now());
      })
      .catch(() => setLoadFailed(true));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const now = useNow(offset);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [quizSlug, setQuizSlug] = useState<string | null>(null);
  const [boardOpen, setBoardOpen] = useState(() => !isTouch && window.innerWidth > 900);
  const [target, setTarget] = useState<string | null>(null);
  const [engineFailed, setEngineFailed] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [achievement, setAchievement] = useState<string | null>(null);

  const feeds = useMemo(
    () => ({
      aim: createFeed<Aim | null>(null, sameAim),
      pose: createFeed<ShipPose | null>(null),
      speed: createFeed(0),
    }),
    [],
  );
  const engine = useRef<Explorer | null>(null);
  const mount = useRef<HTMLDivElement>(null);
  const stick = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLSpanElement>(null);
  const throttleUp = useRef<HTMLButtonElement>(null);
  const throttleDown = useRef<HTMLButtonElement>(null);

  // Each planet's name, its lesson's title but for First steps, which also says
  // the lessons it covers
  const { titles, covers } = useMemo(() => {
    const course = courses.find((c) => c.key === state?.courseKey);
    const lessons = course?.lessons ?? [];
    const names = new Map(lessons.map((l) => [l.slug, l.title]));
    const spans = new Map<string, string>();
    for (const p of planetLessons(lessons.map((l) => l.slug))) {
      if (p.lessons.length < 2) continue;
      names.set(p.slug, t('laniakea.firstSteps.name'));
      spans.set(p.slug, t('laniakea.firstSteps.covers', { count: p.lessons.length }));
    }
    return { titles: names, covers: spans };
  }, [courses, state?.courseKey, t]);

  const slugKey = state?.planets.map((p) => p.slug).join(',') ?? '';
  const spots = useMemo(
    () => (slugKey ? layoutPlanets(slugKey.split(','), LOOK_COUNT) : []),
    [slugKey],
  );
  const planets = useMemo(() => new Map(state?.planets.map((p) => [p.slug, p])), [state]);

  // Marks change with the state and when a recap opens, so a coarse clock does
  const markClock = Math.floor(now / 15000);
  const marks = useMemo(() => {
    const out: Record<string, PlanetMark> = {};
    const at = markClock * 15000;
    for (const p of state?.planets ?? []) out[p.slug] = markOf(p, statusOf(p, at));
    return out;
  }, [state, markClock]);

  const unlocked = state?.unlocked ?? false;
  useEffect(() => {
    if (!unlocked || !spots.length || !mount.current) return;
    let disposed = false;
    const touch =
      isTouch && stick.current && knob.current && throttleUp.current && throttleDown.current
        ? {
            stick: stick.current,
            knob: knob.current,
            throttleUp: throttleUp.current,
            throttleDown: throttleDown.current,
          }
        : null;
    Promise.all([loadThree(), import('./scene/explorer')])
      .then(([THREE, scene]) => {
        if (disposed || !mount.current) return;
        engine.current = scene.createExplorer(THREE, mount.current, spots, touch, {
          onAim: (aim) => feeds.aim.set(aim),
          onPose: (pose, speed) => {
            feeds.pose.set(pose);
            feeds.speed.set(Math.round(speed * 100) / 100);
          },
        });
        setEngineFailed(false);
        setEngineReady(true);
      })
      .catch(() => setEngineFailed(true));
    return () => {
      disposed = true;
      engine.current?.dispose();
      engine.current = null;
      setEngineReady(false);
    };
  }, [unlocked, spots, isTouch, feeds]);

  useEffect(() => engine.current?.setMarks(marks), [marks, engineReady]);
  useEffect(() => engine.current?.setTarget(target), [target, engineReady]);
  const flying = started && !paused && !leaving && !quizSlug;
  useEffect(() => engine.current?.setActive(flying), [flying, engineReady]);

  const quit = useCallback(() => navigate('/'), [navigate]);

  const land = useCallback(
    (slug: string) => {
      const planet = planets.get(slug);
      if (planet && canFly(statusOf(planet, Date.now() + offset))) setQuizSlug(slug);
    },
    [planets, offset],
  );

  useEffect(() => {
    if (!unlocked) return;
    const onKey = (e: KeyboardEvent) => {
      if (quizSlug) return;
      if (!started) {
        if (e.code === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          setStarted(true);
        }
        return;
      }
      // Q asks first; a second Q leaves, Esc stays
      if (leaving) {
        if (e.code === 'KeyQ') quit();
        if (e.code === 'Escape') setLeaving(false);
        return;
      }
      if (e.code === 'Escape') {
        setPaused((p) => !p);
        return;
      }
      if (e.code === 'KeyQ') {
        setLeaving(true);
        return;
      }
      if (paused) return;
      if (e.code === 'KeyB') setBoardOpen((o) => !o);
      if (e.code === 'KeyE') {
        const aim = feeds.aim.get();
        if (aim?.inReach) land(aim.slug);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [unlocked, started, paused, leaving, quizSlug, quit, land, feeds]);

  useEffect(() => {
    if (!achievement) return;
    const id = setTimeout(() => setAchievement(null), 7000);
    return () => clearTimeout(id);
  }, [achievement]);

  const closeQuiz = (result: QuizAnswerResult | null) => {
    const slug = quizSlug;
    setQuizSlug(null);
    if (result?.planet) {
      const moved = result.planet;
      setState((s) =>
        s ? { ...s, planets: s.planets.map((p) => (p.slug === moved.slug ? moved : p)) } : s,
      );
      if (result.leveledUp && moved.level >= FOREVER_LEVEL && slug) {
        setAchievement(titles.get(slug) ?? slug);
      }
    }
    load();
  };

  if (!state) {
    return (
      <div className="lnk-root">
        <LoadingScreen
          failed={loadFailed}
          onRetry={() => {
            setLoadFailed(false);
            load();
          }}
        />
      </div>
    );
  }
  if (!state.unlocked) {
    return (
      <div className="lnk-root">
        <LockedScreen state={state} />
      </div>
    );
  }

  const targetSpot = spots.find((s) => s.slug === target) ?? null;

  return (
    <div className={`lnk-root ${isTouch ? 'lnk-touch' : ''}`}>
      <div ref={mount} className="lnk-scene" />
      <div className="lnk-vignette" />

      {engineFailed && <LoadingScreen failed onRetry={() => window.location.reload()} />}

      <ShipStats planets={state.planets} now={now} />
      <div className="lnk-hud lnk-top-right">
        <button
          type="button"
          className="lnk-btn"
          aria-pressed={boardOpen}
          onClick={() => setBoardOpen((o) => !o)}
        >
          <PanelRight size={14} /> {t('laniakea.hud.board')}
        </button>
        <button
          type="button"
          className="lnk-btn"
          onClick={() => setPaused(true)}
          aria-label={t('laniakea.hud.pause')}
        >
          <Pause size={14} />
        </button>
        <button
          type="button"
          className="lnk-btn"
          onClick={() => setLeaving(true)}
          aria-label={t('laniakea.hud.quit')}
        >
          <LogOut size={14} />
        </button>
      </div>

      <AimCard
        aim={feeds.aim}
        planets={planets}
        titles={titles}
        covers={covers}
        now={now}
        isTouch={isTouch}
        onLand={land}
      />
      {achievement && (
        <div className="lnk-hud lnk-panel lnk-aim !top-[120px]" role="status">
          <span className="inline-flex items-center gap-2 lnk-gold font-semibold text-[13px]">
            <Award size={16} /> {t('laniakea.achievement', { planet: achievement })}
          </span>
        </div>
      )}
      {boardOpen && (
        <ShipBoard
          planets={state.planets}
          titles={titles}
          covers={covers}
          now={now}
          target={target}
          onTarget={(slug) => {
            setTarget(slug);
            // a narrow board covers the sky, so it steps aside for the arrow
            if (window.innerWidth <= 900) setBoardOpen(false);
          }}
          onClose={() => setBoardOpen(false)}
        />
      )}
      {/* with the board open, the board itself asks for a target */}
      {(target || !boardOpen) && (
        <TargetReadout
          pose={feeds.pose}
          spot={targetSpot}
          title={target ? (titles.get(target) ?? target) : null}
        />
      )}
      <StarMap pose={feeds.pose} spots={spots} marks={marks} target={target} />
      {!isTouch && <SpeedPanel speed={feeds.speed} />}

      {isTouch && (
        <>
          <div className="lnk-throttle">
            <button ref={throttleUp} type="button" aria-label={t('laniakea.hud.forward')}>
              <ChevronUp size={20} />
            </button>
            <button ref={throttleDown} type="button" aria-label={t('laniakea.hud.back')}>
              <ChevronDown size={20} />
            </button>
          </div>
          <div ref={stick} className="lnk-stick">
            <span ref={knob} />
          </div>
        </>
      )}

      {!started && <IntroScreen isTouch={isTouch} onBegin={() => setStarted(true)} />}
      {started && paused && !leaving && !quizSlug && (
        <PauseScreen onResume={() => setPaused(false)} onQuit={quit} />
      )}
      {leaving && !quizSlug && <LeaveScreen onStay={() => setLeaving(false)} onLeave={quit} />}
      {quizSlug && (
        <QuizDialog
          slug={quizSlug}
          title={titles.get(quizSlug) ?? quizSlug}
          lang={lang}
          now={now}
          onClose={closeQuiz}
        />
      )}
    </div>
  );
}
