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
      const sectionIds = [
        's-boot',
        's-langs',
        's-almanac',
        's-forum',
        's-messaging',
        's-connections',
        's-leaderboard',
        's-laniakea',
        's-cta',
      ];
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
            lessons={47}
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
            lessons={49}
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
            lessons={60}
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
            lessons={55}
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
              <div className="wc-stat">
                <span className="wc-stat-ico">📚</span>
                <div className="wc-stat-label">{t('welcome.almanac.stats.articles')}</div>
              </div>
              <div className="wc-stat">
                <span className="wc-stat-ico">🗺️</span>
                <div className="wc-stat-label">{t('welcome.almanac.stats.topics')}</div>
              </div>
              <div className="wc-stat">
                <span className="wc-stat-ico">✨</span>
                <div className="wc-stat-label">{t('welcome.almanac.stats.funFacts')}</div>
              </div>
            </div>
          </div>
          <div className="wc-almanac-mock reveal" data-delay="4">
            <div className="wc-alm-chips">
              <span className="wc-alm-chip active">✦ All</span>
              <span className="wc-alm-chip">📜 History</span>
              <span className="wc-alm-chip">🐧 Open Source</span>
              <span className="wc-alm-chip">👑 Legends</span>
              <span className="wc-alm-chip">🪐 Space</span>
            </div>
            <div className="wc-alm-card">
              <div
                className="wc-alm-art"
                style={{ background: 'linear-gradient(135deg,#6C5CE7,#3a2f8f)' }}
              >
                👑
              </div>
              <div className="wc-alm-body">
                <div className="wc-alm-tag">LEGENDS · 1843</div>
                <div className="wc-alm-title">Ada Lovelace wrote code before computers existed</div>
                <div className="wc-alm-excerpt">
                  The first algorithm in history — written a century before the machine to run it.
                </div>
              </div>
            </div>
            <div className="wc-alm-card">
              <div
                className="wc-alm-art"
                style={{ background: 'linear-gradient(135deg,#7CEEAE,#2f8f5c)' }}
              >
                🐧
              </div>
              <div className="wc-alm-body">
                <div className="wc-alm-tag">OPEN SOURCE · 1991</div>
                <div className="wc-alm-title">
                  How a 21-year-old in Helsinki accidentally changed the world
                </div>
                <div className="wc-alm-excerpt">
                  “Just a hobby, won't be big and professional like gnu.” Today Linux runs the
                  cloud.
                </div>
              </div>
            </div>
            <div className="wc-alm-card">
              <div
                className="wc-alm-art"
                style={{ background: 'linear-gradient(135deg,#FF9A6E,#8f452f)' }}
              >
                🚀
              </div>
              <div className="wc-alm-body">
                <div className="wc-alm-tag">LEGENDS · 1969</div>
                <div className="wc-alm-title">
                  Margaret Hamilton wrote the code that landed Apollo 11
                </div>
                <div className="wc-alm-excerpt">
                  She coined “software engineering” — and her overflow handling saved the moon
                  landing.
                </div>
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
              <div className="wc-stat">
                <span className="wc-stat-ico">🧵</span>
                <div className="wc-stat-label">{t('welcome.forum.stats.threads')}</div>
              </div>
              <div className="wc-stat">
                <span className="wc-stat-ico">💬</span>
                <div className="wc-stat-label">{t('welcome.forum.stats.answers')}</div>
              </div>
              <div className="wc-stat">
                <span className="wc-stat-ico">✅</span>
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
                  maria_r
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
                  sk_dev <span className="wc-forum-role wc-mod">MOD</span>
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
                  alex_l
                  <span className="wc-forum-time">1m ago</span>
                </div>
                <div className="wc-forum-text">Ohh, that was it. Thanks — fixed! 🙏</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MESSAGING */}
      <section className="wc-section" id="s-messaging">
        <div className="wc-section-num reveal">{t('welcome.messaging.num')}</div>
        <div className="wc-split">
          <div className="wc-dm-mock forum-mock reveal" data-delay="4">
            <div className="wc-dm-head">
              <div
                className="wc-forum-avatar"
                style={{ background: 'linear-gradient(135deg,#7CEEAE,#3aa76a)', color: '#1a1a1a' }}
              >
                RO
              </div>
              <div className="wc-dm-head-meta">
                <div className="wc-dm-head-name">Rodawrath</div>
              </div>
            </div>
            <div className="wc-dm-body">
              <div className="wc-dm-bubble wc-dm-in">
                Yo, you around? Stuck on the recursion challenge 😅
                <span className="wc-dm-time">14:02</span>
              </div>
              <div className="wc-dm-bubble wc-dm-out">
                Yeah! Just cleared that one, took me a while
                <span className="wc-dm-time">14:03</span>
              </div>
              <div className="wc-dm-receipt">{t('welcome.messaging.read')}</div>
              <div className="wc-dm-bubble wc-dm-in">
                Nice, drop me your solution when you can
                <div className="wc-dm-reactions">
                  <span className="wc-dm-reaction">🙌 1</span>
                </div>
                <span className="wc-dm-time">14:03</span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="wc-title reveal" data-delay="1">
              <Trans
                i18nKey="welcome.messaging.title"
                components={[<span />, ACCENT, <span />, <br />]}
              />
            </h2>
            <p className="wc-subtitle reveal" data-delay="2">
              {t('welcome.messaging.subtitle')}
            </p>
            <div className="wc-stats reveal" data-delay="3">
              <div className="wc-stat">
                <span className="wc-stat-ico">👥</span>
                <div className="wc-stat-label">{t('welcome.messaging.stats.private')}</div>
              </div>
              <div className="wc-stat">
                <span className="wc-stat-ico">⚡</span>
                <div className="wc-stat-label">{t('welcome.messaging.stats.realtime')}</div>
              </div>
              <div className="wc-stat">
                <span className="wc-stat-ico">😀</span>
                <div className="wc-stat-label">{t('welcome.messaging.stats.reactions')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECTIONS */}
      <section className="wc-section" id="s-connections">
        <div className="wc-section-num reveal">{t('welcome.connections.num')}</div>
        <div className="wc-split wc-reverse">
          <div>
            <h2 className="wc-title reveal" data-delay="1">
              <Trans
                i18nKey="welcome.connections.title"
                components={[<span />, ACCENT, <span />, <br />]}
              />
            </h2>
            <p className="wc-subtitle reveal" data-delay="2">
              {t('welcome.connections.subtitle')}
            </p>
            <div className="wc-stats reveal" data-delay="3">
              <div className="wc-stat">
                <span className="wc-stat-ico">🤝</span>
                <div className="wc-stat-label">{t('welcome.connections.stats.requests')}</div>
              </div>
              <div className="wc-stat">
                <span className="wc-stat-ico">🔗</span>
                <div className="wc-stat-label">{t('welcome.connections.stats.network')}</div>
              </div>
              <div className="wc-stat">
                <span className="wc-stat-ico">👤</span>
                <div className="wc-stat-label">{t('welcome.connections.stats.profile')}</div>
              </div>
            </div>
          </div>
          <div className="wc-conn-mock forum-mock reveal" data-delay="4">
            <div className="wc-conn-card">
              <div
                className="wc-forum-avatar"
                style={{ background: 'linear-gradient(135deg,#7AB6FF,#3a73c7)' }}
              >
                YR
              </div>
              <div className="wc-conn-meta">
                <div className="wc-conn-name">YehoslavR</div>
                <div className="wc-conn-sub">{t('welcome.connections.wantsToConnect')}</div>
              </div>
              <div className="wc-conn-actions">
                <button className="wc-conn-btn wc-conn-accept" type="button">
                  {t('welcome.connections.accept')}
                </button>
                <button className="wc-conn-btn wc-conn-decline" type="button">
                  {t('welcome.connections.decline')}
                </button>
              </div>
            </div>
            <div className="wc-conn-card">
              <div
                className="wc-forum-avatar"
                style={{ background: 'linear-gradient(135deg,#FF9A6E,#c66b40)' }}
              >
                SI
              </div>
              <div className="wc-conn-meta">
                <div className="wc-conn-name">Simon11</div>
                <div className="wc-conn-sub">{t('welcome.connections.requestSent')}</div>
              </div>
              <div className="wc-conn-actions">
                <span className="wc-conn-pill">{t('welcome.connections.pending')}</span>
              </div>
            </div>
            <div className="wc-conn-card">
              <div
                className="wc-forum-avatar"
                style={{ background: 'linear-gradient(135deg,#FFD24A,#c79a1a)', color: '#1a1a1a' }}
              >
                YY
              </div>
              <div className="wc-conn-meta">
                <div className="wc-conn-name">yyosako</div>
              </div>
              <div className="wc-conn-actions">
                <span className="wc-conn-pill wc-conn-connected">
                  ✓ {t('welcome.connections.connected')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section className="wc-section" id="s-leaderboard">
        <div className="wc-section-num reveal">{t('welcome.leaderboard.num')}</div>
        <div className="wc-split">
          <div className="wc-lb-mock forum-mock reveal" data-delay="4">
            <div className="wc-lb-head">
              <span>#</span>
              <span>{t('welcome.leaderboard.person')}</span>
              <span className="wc-lb-xp-col">XP</span>
            </div>
            <div className="wc-lb-row">
              <span className="wc-lb-rank">🥇</span>
              <div
                className="wc-forum-avatar wc-lb-av"
                style={{ background: 'linear-gradient(135deg,#FFD24A,#c79a1a)', color: '#1a1a1a' }}
              >
                TO
              </div>
              <span className="wc-lb-name">TON618</span>
              <span className="wc-lb-lvl">⭐ L24</span>
              <div className="wc-lb-xpcell">
                <span className="wc-lb-xp">18,420 XP</span>
                <span className="wc-lb-lessons">
                  {t('welcome.leaderboard.lessons', { count: 142 })}
                </span>
              </div>
            </div>
            <div className="wc-lb-row">
              <span className="wc-lb-rank">🥈</span>
              <div
                className="wc-forum-avatar wc-lb-av"
                style={{ background: 'linear-gradient(135deg,#cbd5e1,#94a3b8)', color: '#1a1a1a' }}
              >
                LA
              </div>
              <span className="wc-lb-name">LaniakeaPRJ</span>
              <span className="wc-lb-lvl">⭐ L21</span>
              <div className="wc-lb-xpcell">
                <span className="wc-lb-xp">15,905 XP</span>
                <span className="wc-lb-lessons">
                  {t('welcome.leaderboard.lessons', { count: 121 })}
                </span>
              </div>
            </div>
            <div className="wc-lb-row">
              <span className="wc-lb-rank">🥉</span>
              <div
                className="wc-forum-avatar wc-lb-av"
                style={{ background: 'linear-gradient(135deg,#d08b5b,#a25f31)' }}
              >
                MH
              </div>
              <span className="wc-lb-name">Marco Hoeger</span>
              <span className="wc-lb-lvl">⭐ L19</span>
              <div className="wc-lb-xpcell">
                <span className="wc-lb-xp">13,240 XP</span>
                <span className="wc-lb-lessons">
                  {t('welcome.leaderboard.lessons', { count: 98 })}
                </span>
              </div>
            </div>
            <div className="wc-lb-row wc-lb-you">
              <span className="wc-lb-rank">#46</span>
              <div
                className="wc-forum-avatar wc-lb-av"
                style={{ background: 'linear-gradient(135deg,#6C5CE7,#a855f7)' }}
              >
                TV
              </div>
              <span className="wc-lb-name">
                Tommy Vercetti <span className="wc-lb-youtag">YOU</span>
              </span>
              <span className="wc-lb-lvl">⭐ L12</span>
              <div className="wc-lb-xpcell">
                <span className="wc-lb-xp">6,880 XP</span>
                <span className="wc-lb-lessons">
                  {t('welcome.leaderboard.lessons', { count: 52 })}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h2 className="wc-title reveal" data-delay="1">
              <Trans
                i18nKey="welcome.leaderboard.title"
                components={[<span />, ACCENT, <span />, <br />]}
              />
            </h2>
            <p className="wc-subtitle reveal" data-delay="2">
              {t('welcome.leaderboard.subtitle')}
            </p>
            <div className="wc-stats reveal" data-delay="3">
              <div className="wc-stat">
                <span className="wc-stat-ico">⭐</span>
                <div className="wc-stat-label">{t('welcome.leaderboard.stats.perLesson')}</div>
              </div>
              <div className="wc-stat">
                <span className="wc-stat-ico">🚀</span>
                <div className="wc-stat-label">{t('welcome.leaderboard.stats.levels')}</div>
              </div>
              <div className="wc-stat">
                <span className="wc-stat-ico">🌌</span>
                <div className="wc-stat-label">{t('welcome.leaderboard.stats.climb')}</div>
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
