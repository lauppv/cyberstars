import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import './WelcomePage.css';

const ACCENT = <span className="wc-accent-text" />;

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('.reveal, .forum-mock, .network-wrap, .lang-connect');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);
  return ref;
}

function HeroStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w: number, h: number;
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      w = canvas.width = rect.width * devicePixelRatio;
      h = canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };
    resize();
    window.addEventListener('resize', resize);
    const N = 90;
    const stars = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      s: Math.random() * 1.4 + 0.2,
    }));
    let raf: number;
    function tick() {
      ctx!.fillStyle = 'rgba(11,11,17,0.18)';
      ctx!.fillRect(0, 0, w, h);
      for (const s of stars) {
        s.y += 0.00018 * (1 - s.z);
        if (s.y > 1) s.y = 0;
        const a = (1 - s.z) * 0.7;
        ctx!.globalAlpha = a;
        ctx!.fillStyle = '#E8E8FF';
        ctx!.beginPath();
        ctx!.arc(s.x * w, s.y * h, s.s * devicePixelRatio, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="wc-hero-stars" />;
}

export function WelcomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const rootRef = useReveal();
  const spRef = useRef<HTMLDivElement>(null);
  const clFillRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  const onScroll = useCallback(() => {
    const docH = document.documentElement.scrollHeight;
    const scrolled = window.scrollY;
    const max = docH - window.innerHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    if (spRef.current) spRef.current.style.width = pct + '%';

    const trigger = scrolled + window.innerHeight * 0.72;
    let activeIdx = -1;
    nodesRef.current.forEach((n, i) => {
      if (!n) return;
      const nTop = parseFloat(n.style.top) || 0;
      if (nTop <= trigger) activeIdx = i;
    });

    if (clFillRef.current) {
      if (activeIdx >= 0 && nodesRef.current[activeIdx]) {
        const nTop = parseFloat(nodesRef.current[activeIdx]!.style.top) || 0;
        clFillRef.current.style.height = Math.max(0, nTop - 60) + 'px';
      } else {
        clFillRef.current.style.height = '0px';
      }
    }
    nodesRef.current.forEach((n, i) => {
      if (n) n.classList.toggle('active', i <= activeIdx);
    });
  }, []);

  useEffect(() => {
    const positionNodes = () => {
      const sectionIds = ['s-boot', 's-langs', 's-almanac', 's-forum', 's-laniakea', 's-cta'];
      nodesRef.current.forEach((n, i) => {
        if (!n) return;
        const target = document.getElementById(sectionIds[i]);
        if (target) n.style.top = target.offsetTop + 100 + 'px';
      });
    };
    positionNodes();
    window.addEventListener('resize', positionNodes);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('resize', positionNodes);
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  // Boot bar animation
  useEffect(() => {
    const bootBlock = document.querySelector('.wc-boot-block');
    if (!bootBlock) return;
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            document.querySelectorAll('.wc-boot-row').forEach((row, i) => {
              const fill = row.querySelector<HTMLElement>('.wc-boot-bar-fill');
              const pctEl = row.querySelector<HTMLElement>('.wc-boot-pct');
              if (!fill || !pctEl) return;
              const f = fill;
              const p2 = pctEl;
              setTimeout(() => {
                f.style.width = '100%';
                const start = performance.now();
                function step(t: number) {
                  const p = Math.min(1, (t - start) / 1400);
                  const eased = 1 - Math.pow(1 - p, 3);
                  p2.textContent = Math.round(eased * 100) + '%';
                  if (p < 1) requestAnimationFrame(step);
                  else p2.classList.add('done');
                }
                requestAnimationFrame(step);
              }, i * 320);
            });
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' },
    );
    io.observe(bootBlock);
    return () => io.disconnect();
  }, []);

  const nodeLabels = t('welcome.nodes', { returnObjects: true }) as string[];

  return (
    <div className="wc-page" ref={rootRef}>
      <div className="wc-bg-grid" />
      <div className="wc-bg-orbs" />

      {/* Scroll progress */}
      <div className="wc-scroll-progress">
        <div className="wc-scroll-progress-fill" ref={spRef} />
      </div>

      {/* Topbar */}
      <header className="wc-topbar">
        <div className="wc-logo" onClick={() => navigate('/')}>
          <svg
            className="wc-logo-icon"
            viewBox="0 0 64 64"
            width="22"
            height="22"
            style={{ filter: 'drop-shadow(0 0 8px var(--accent-glow))' }}
          >
            <polygon
              points="32,4 39,24 60,24 43,37 49,58 32,46 15,58 21,37 4,24 25,24"
              fill="var(--accent)"
            />
          </svg>
          <span className="wc-logo-text">CyberStars</span>
        </div>
        <button className="wc-skip" onClick={() => navigate('/')}>
          {t('welcome.skip')}
        </button>
      </header>

      {/* Centerline */}
      <div className="wc-centerline" aria-hidden="true">
        <div className="wc-centerline-track" />
        <div className="wc-centerline-fill" ref={clFillRef} />
        {nodeLabels.map((label, i) => (
          <div
            key={i}
            className="wc-centerline-node"
            ref={(el) => {
              nodesRef.current[i] = el;
            }}
          >
            <span className="wc-centerline-label">{label}</span>
          </div>
        ))}
      </div>

      {/* HERO */}
      <section className="wc-section wc-hero" id="s-hero">
        <HeroStarfield />
        <span className="wc-eyebrow wc-hero-eyebrow wc-fade-in">
          <span className="wc-eyebrow-dot" />
          {t('welcome.hero.eyebrow')}
        </span>
        <h1 className="wc-hero-title">
          <span className="wc-line">
            <span>{t('welcome.hero.welcomeTo')}</span>
          </span>
          <span className="wc-line">
            <span className="wc-accent-text">CyberStars.</span>
          </span>
        </h1>
        <p className="wc-hero-sub">{t('welcome.hero.sub')}</p>
        <div className="wc-hero-scroll">
          {t('welcome.hero.scroll')}
          <div className="wc-hero-scroll-arrow" />
        </div>
      </section>

      {/* BOOTING */}
      <section className="wc-section" id="s-boot">
        <div className="wc-section-num reveal">{t('welcome.boot.num')}</div>
        <h2 className="wc-title reveal" data-delay="1">
          <Trans i18nKey="welcome.boot.title" components={[<span />, ACCENT]} />
        </h2>
        <p className="wc-subtitle reveal" data-delay="2">
          {t('welcome.boot.subtitle')}
        </p>
        <div className="wc-boot-block reveal" data-delay="3">
          {(t('welcome.boot.steps', { returnObjects: true }) as string[]).map((label) => (
            <div className="wc-boot-row" key={label}>
              <div className="wc-boot-label">
                <span className="wc-boot-prefix">›</span>
                {label}
              </div>
              <div className="wc-boot-bar">
                <div className="wc-boot-bar-fill" />
              </div>
              <div className="wc-boot-pct">0%</div>
            </div>
          ))}
        </div>
      </section>

      {/* LANGUAGES */}
      <section className="wc-section wc-langs" id="s-langs">
        <div className="wc-section-num reveal">{t('welcome.langs.num')}</div>
        <h2 className="wc-title reveal" data-delay="1">
          <Trans i18nKey="welcome.langs.title" components={[<span />, <br />, <span />, ACCENT]} />
        </h2>
        <p className="wc-subtitle reveal" data-delay="2">
          {t('welcome.langs.subtitle')}
        </p>
        <div className="wc-langs-grid">
          <LangCard
            delay="3"
            color="#7AB6FF"
            num={t('welcome.langs.cards.c.num')}
            icon="C"
            name="C"
            tag={t('welcome.langs.cards.c.tag')}
            desc={t('welcome.langs.cards.c.desc')}
            lessons={48}
            hours="22h"
            lessonsLabel={t('welcome.langs.lessonsLabel')}
          />
          <LangConnect delay="4" from="#7AB6FF" to="#FF9A6E" />
          <LangCard
            delay="5"
            color="#FF9A6E"
            num={t('welcome.langs.cards.java.num')}
            icon="Ja"
            name="Java"
            tag={t('welcome.langs.cards.java.tag')}
            desc={t('welcome.langs.cards.java.desc')}
            lessons={56}
            hours="28h"
            lessonsLabel={t('welcome.langs.lessonsLabel')}
          />
          <LangConnect delay="6" from="#FF9A6E" to="#FFD24A" />
          <LangCard
            delay="7"
            color="#FFD24A"
            num={t('welcome.langs.cards.python.num')}
            icon="Py"
            name="Python"
            tag={t('welcome.langs.cards.python.tag')}
            desc={t('welcome.langs.cards.python.desc')}
            lessons={62}
            hours="26h"
            lessonsLabel={t('welcome.langs.lessonsLabel')}
          />
          <LangConnect delay="8" from="#FFD24A" to="#7CEEAE" />
          <LangCard
            delay="9"
            color="#7CEEAE"
            num={t('welcome.langs.cards.bash.num')}
            icon="$_"
            name="Bash"
            tag={t('welcome.langs.cards.bash.tag')}
            desc={t('welcome.langs.cards.bash.desc')}
            lessons={34}
            hours="14h"
            lessonsLabel={t('welcome.langs.lessonsLabel')}
          />
        </div>
      </section>

      {/* ALMANAC */}
      <section className="wc-section" id="s-almanac">
        <div className="wc-section-num reveal">{t('welcome.almanac.num')}</div>
        <div className="wc-split">
          <div>
            <h2 className="wc-title reveal" data-delay="1">
              <Trans
                i18nKey="welcome.almanac.title"
                components={[<span />, ACCENT, <span />, <br />]}
              />
            </h2>
            <p className="wc-subtitle reveal" data-delay="2">
              {t('welcome.almanac.subtitle')}
            </p>
            <div className="wc-stats reveal" data-delay="3">
              <div>
                <div className="wc-stat-num">2,418</div>
                <div className="wc-stat-label">{t('welcome.almanac.stats.entries')}</div>
              </div>
              <div>
                <div className="wc-stat-num">9k+</div>
                <div className="wc-stat-label">{t('welcome.almanac.stats.examples')}</div>
              </div>
              <div>
                <div className="wc-stat-num">&lt;1s</div>
                <div className="wc-stat-label">{t('welcome.almanac.stats.search')}</div>
              </div>
            </div>
          </div>
          <div className="wc-almanac-mock reveal" data-delay="4">
            <div className="wc-almanac-tabs">
              <div className="wc-almanac-tab active">ALL</div>
              <div className="wc-almanac-tab">C</div>
              <div className="wc-almanac-tab">JAVA</div>
              <div className="wc-almanac-tab">PYTHON</div>
              <div className="wc-almanac-tab">BASH</div>
            </div>
            <div className="wc-almanac-search">
              / search: <span className="wc-search-text">malloc</span>
              <span className="wc-blink">▍</span>
            </div>
            <div className="wc-almanac-entry">
              <div className="wc-almanac-entry-title">
                <span className="wc-kind fn">FN</span> malloc <code>void *malloc(size_t)</code>
              </div>
              <div className="wc-almanac-entry-desc">
                Allocates uninitialised memory on the heap. Pair with <code>free()</code> or leak.
              </div>
            </div>
            <div className="wc-almanac-entry">
              <div className="wc-almanac-entry-title">
                <span className="wc-kind kw">KW</span> yield <code>generator semantics</code>
              </div>
              <div className="wc-almanac-entry-desc">
                Pauses execution, returns a value, resumes on next iteration. Python's lazy hero.
              </div>
            </div>
            <div className="wc-almanac-entry">
              <div className="wc-almanac-entry-title">
                <span className="wc-kind cmd">CMD</span> grep <code>grep -rni pattern path</code>
              </div>
              <div className="wc-almanac-entry-desc">
                Recursive, line-numbered, case-insensitive search. Bash's first-aid kit.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORUM */}
      <section className="wc-section" id="s-forum">
        <div className="wc-section-num reveal">{t('welcome.forum.num')}</div>
        <div className="wc-split wc-reverse">
          <div>
            <h2 className="wc-title reveal" data-delay="1">
              <Trans
                i18nKey="welcome.forum.title"
                components={[<span />, ACCENT, <span />, <br />]}
              />
            </h2>
            <p className="wc-subtitle reveal" data-delay="2">
              {t('welcome.forum.subtitle')}
            </p>
            <div className="wc-stats reveal" data-delay="3">
              <div>
                <div className="wc-stat-num">8min</div>
                <div className="wc-stat-label">{t('welcome.forum.stats.avgReply')}</div>
              </div>
              <div>
                <div className="wc-stat-num">14k</div>
                <div className="wc-stat-label">{t('welcome.forum.stats.threads')}</div>
              </div>
              <div>
                <div className="wc-stat-num">98%</div>
                <div className="wc-stat-label">{t('welcome.forum.stats.solved')}</div>
              </div>
            </div>
          </div>
          <div className="wc-forum-mock forum-mock reveal" data-delay="4">
            <div className="wc-forum-msg">
              <div
                className="wc-forum-avatar"
                style={{ background: 'linear-gradient(135deg,#7AB6FF,#3a73c7)' }}
              >
                MR
              </div>
              <div className="wc-forum-meta">
                <div className="wc-forum-name">
                  maria_r <span className="wc-forum-role">L7</span>
                  <span className="wc-forum-time">2m ago</span>
                </div>
                <div className="wc-forum-text">
                  Segfault on lesson 12 — am I freeing the right pointer?{' '}
                  <code>free(buf); buf = NULL;</code>
                </div>
              </div>
            </div>
            <div className="wc-forum-msg">
              <div
                className="wc-forum-avatar"
                style={{ background: 'linear-gradient(135deg,#FFD24A,#c79a1a)', color: '#1a1a1a' }}
              >
                SK
              </div>
              <div className="wc-forum-meta">
                <div className="wc-forum-name">
                  sk_mentor <span className="wc-forum-role wc-mentor">MENTOR</span>
                  <span className="wc-forum-time">just now</span>
                </div>
                <div className="wc-forum-text">
                  That part's fine ✅ — but check the <code>for</code> loop right above:{' '}
                  <code>i &lt;= n</code> walks one past the end.
                </div>
                <div className="wc-forum-reactions">
                  <span className="wc-forum-reaction">🔥 12</span>
                  <span className="wc-forum-reaction">✅ solved</span>
                </div>
              </div>
            </div>
            <div className="wc-forum-msg">
              <div
                className="wc-forum-avatar"
                style={{ background: 'linear-gradient(135deg,#FF9A6E,#c66b40)' }}
              >
                AL
              </div>
              <div className="wc-forum-meta">
                <div className="wc-forum-name">
                  alex_l <span className="wc-forum-role">L4</span>
                  <span className="wc-forum-time">writing…</span>
                </div>
                <div className="wc-forum-text wc-typing">alex_l is typing a reply…</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LANIAKEA EXPLORER */}
      <section className="wc-section" id="s-laniakea">
        <div className="wc-section-num reveal">{t('welcome.laniakea.num')}</div>
        <div className="wc-split">
          <div className="reveal" data-delay="3">
            <div className="wc-viewport">
              <div className="wc-vp-space" />
              <VPStars />
              <div className="wc-vp-top">
                <span className="wc-vp-tt">CSTR-9</span>
                <span className="wc-vp-vent">
                  {Array.from({ length: 20 }, (_, i) => (
                    <span key={i} />
                  ))}
                </span>
                <span className="wc-vp-tt wc-green">NAV · OK</span>
              </div>
              <div className="wc-vp-rocky" />
              <div className="wc-vp-moon" />
              <div className="wc-vp-ring" />
              <div className="wc-vp-planet wc-vp-gas" />
              <div className="wc-vp-bh">
                <div className="wc-vp-bh-disk" />
                <div className="wc-vp-bh-photon" />
                <div className="wc-vp-bh-core" />
              </div>
              <div className="wc-vp-hud">
                <div className="wc-vp-hud-tl">
                  <div className="wc-vp-ln">
                    <span className="wc-vp-dot" />
                    SECTOR ζ-4
                  </div>
                  <div>HDG 274° · SPD 0.42c</div>
                </div>
                <div className="wc-vp-hud-tr">
                  BODIES · 3<br />
                  FUEL · 87%
                  <br />
                  HULL · 100%
                </div>
              </div>
              <div className="wc-vp-reticle">
                <div className="wc-vp-rt-box" />
              </div>
              <div className="wc-vp-label wc-lbl-gas">SIENNA β · 4.2 AU</div>
              <div className="wc-vp-label wc-lbl-bh">⚠ SINGULARITY</div>
              <div className="wc-vp-bot">
                <span className="wc-vp-gauge">
                  <span className="wc-vp-lbl">PWR</span>
                  <span className="wc-vp-val">98%</span>
                </span>
                <span className="wc-vp-bar" />
                <span className="wc-vp-gauge">
                  <span className="wc-vp-lbl">DIST</span>
                  <span className="wc-vp-val">4.2 AU</span>
                </span>
              </div>
              <div className="wc-vp-scan" />
            </div>
          </div>
          <div>
            <h2 className="wc-title reveal" data-delay="1">
              <Trans
                i18nKey="welcome.laniakea.title"
                components={[<span />, ACCENT, <span />, <br />]}
              />
            </h2>
            <p className="wc-subtitle reveal" data-delay="2">
              {t('welcome.laniakea.subtitle')}
            </p>
            <div className="wc-controls reveal" data-delay="3">
              <div className="wc-controls-title">{t('welcome.laniakea.controlsTitle')}</div>
              <div>
                <span className="wc-ctrl-key">WASD</span> · {t('welcome.laniakea.navigate')}
              </div>
              <div>
                <span className="wc-ctrl-key">MOUSE</span> · {t('welcome.laniakea.steer')}
              </div>
              <div>
                <span className="wc-ctrl-key">SHIFT</span> · {t('welcome.laniakea.boost')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NETWORK */}
      <section className="wc-section wc-tight">
        <div className="wc-section-num reveal">{t('welcome.network.num')}</div>
        <h2 className="wc-title reveal wc-center" data-delay="1">
          <Trans i18nKey="welcome.network.title" components={[<span />, ACCENT]} />
        </h2>
        <p className="wc-subtitle reveal wc-center" data-delay="2">
          {t('welcome.network.subtitle')}
        </p>
        <div className="wc-network-wrap network-wrap reveal" data-delay="3">
          <svg className="wc-network-svg" viewBox="0 0 800 360">
            <defs>
              <linearGradient id="netGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6C5CE7" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6C5CE7" />
              </radialGradient>
            </defs>
            <path className="wc-link" d="M 400 180 Q 280 100 130 80" />
            <path className="wc-link" d="M 400 180 Q 540 90 680 80" />
            <path className="wc-link" d="M 400 180 Q 230 220 90 270" />
            <path className="wc-link" d="M 400 180 Q 540 250 700 270" />
            <path className="wc-link" d="M 400 180 Q 400 280 400 320" />
            <path className="wc-link" d="M 400 180 Q 400 100 400 50" />
            <circle className="wc-node-c" cx={130} cy={80} r={28} />
            <text className="wc-node-label" x={130} y={84}>
              {t('welcome.network.nodes.lessons')}
            </text>
            <circle className="wc-node-c" cx={680} cy={80} r={28} />
            <text className="wc-node-label" x={680} y={84}>
              {t('welcome.network.nodes.almanac')}
            </text>
            <circle className="wc-node-c" cx={90} cy={270} r={28} />
            <text className="wc-node-label" x={90} y={274}>
              {t('welcome.network.nodes.forum')}
            </text>
            <circle className="wc-node-c" cx={700} cy={270} r={28} />
            <text className="wc-node-label" x={700} y={274}>
              {t('welcome.network.nodes.laniakea')}
            </text>
            <circle className="wc-node-c" cx={400} cy={320} r={28} />
            <text className="wc-node-label" x={400} y={324}>
              {t('welcome.network.nodes.badges')}
            </text>
            <circle className="wc-node-c" cx={400} cy={50} r={28} />
            <text className="wc-node-label" x={400} y={54}>
              {t('welcome.network.nodes.editor')}
            </text>
            <circle
              className="wc-node-hub"
              cx={400}
              cy={180}
              r={42}
              fill="url(#hubGrad)"
              stroke="#6C5CE7"
            />
            <text className="wc-node-hub-label" x={400} y={185}>
              {t('welcome.network.nodes.you')}
            </text>
          </svg>
        </div>
      </section>

      {/* CTA */}
      <section className="wc-cta" id="s-cta">
        <div className="reveal">
          <span className="wc-eyebrow">
            <span className="wc-eyebrow-dot" />
            {t('welcome.cta.eyebrow')}
          </span>
        </div>
        <h2 className="wc-title reveal" data-delay="1">
          <Trans i18nKey="welcome.cta.title" components={[<span />, ACCENT]} />
        </h2>
        <p className="wc-subtitle reveal wc-center" data-delay="2">
          {t('welcome.cta.subtitle')}
        </p>
        <div className="reveal" data-delay="3">
          <button className="wc-cta-btn" onClick={() => navigate('/')}>
            {t('welcome.cta.button')}
            <svg
              className="wc-cta-arrow"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
        <div className="wc-cta-foot reveal" data-delay="4">
          {t('welcome.cta.foot')}
        </div>
      </section>
    </div>
  );
}

function LangCard({
  delay,
  color,
  num,
  icon,
  name,
  tag,
  desc,
  lessons,
  hours,
  lessonsLabel,
}: {
  delay: string;
  color: string;
  num: string;
  icon: string;
  name: string;
  tag: string;
  desc: string;
  lessons: number;
  hours: string;
  lessonsLabel: string;
}) {
  return (
    <div
      className="wc-lang-card reveal"
      data-delay={delay}
      style={{ '--c': color } as React.CSSProperties}
    >
      <div className="wc-lang-num">{num}</div>
      <div className="wc-lang-icon">{icon}</div>
      <div className="wc-lang-name">{name}</div>
      <div className="wc-lang-tag">{tag}</div>
      <div className="wc-lang-desc">{desc}</div>
      <div className="wc-lang-stats">
        <div className="wc-lang-stat">
          <strong>{lessons}</strong> {lessonsLabel}
        </div>
        <div className="wc-lang-stat">
          <strong>{hours}</strong>
        </div>
      </div>
    </div>
  );
}

function LangConnect({ delay, from, to }: { delay: string; from: string; to: string }) {
  return (
    <div className="wc-lang-connect lang-connect reveal" data-delay={delay}>
      <svg viewBox="0 0 64 40" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`lcg-${from}-${to}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <path
          d="M 2 20 L 62 20"
          stroke={`url(#lcg-${from}-${to})`}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="80"
          strokeDashoffset="80"
        />
        <circle cx="32" cy="20" r="10" fill={to} opacity="0" className="wc-node-bg" />
        <circle cx="32" cy="20" r="3" fill="#fff" className="wc-node-dot" />
      </svg>
    </div>
  );
}

const VP_STARS = Array.from({ length: 40 }, () => ({
  left: Math.random() * 100 + '%',
  top: Math.random() * 100 + '%',
  animationDelay: Math.random() * 3 + 's',
  opacity: 0.3 + Math.random() * 0.5,
}));

function VPStars() {
  return (
    <div className="wc-vp-stars">
      {VP_STARS.map((s, i) => (
        <span key={i} style={{ position: 'absolute', ...s }} />
      ))}
    </div>
  );
}
