import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { ApiClientError } from '../services/apiClient';
import { forgotPassword, resetPassword } from '../services/authService';

function getPasswordStrength(pw: string): number {
  if (pw.length === 0) return 0;
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) || /[0-9]/.test(pw) || /[^a-zA-Z0-9]/.test(pw) || pw.length >= 14) s++;
  return s;
}

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number, cx: number, cy: number;
    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      const dpr = window.devicePixelRatio;
      w = canvas.width = rect.width * dpr;
      h = canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      cx = w / 2;
      cy = h / 2;
    };
    resize();
    window.addEventListener('resize', resize);

    const NUM_STARS = 220;
    const SPEED = 0.007;
    const COLORS = ['#FFFFFF', '#E8E8FF', '#C8B8FF', '#FFD8B8', '#B8E8FF'];
    const stars = Array.from({ length: NUM_STARS }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: Math.random(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      twinkle: Math.random() * Math.PI * 2,
    }));

    let rafId: number;
    let lastT = performance.now();
    let running = true;

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        running = false;
      } else {
        if (!running) {
          running = true;
          lastT = performance.now();
          ctx.clearRect(0, 0, w, h);
          rafId = requestAnimationFrame(tick);
        }
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const tick = (t: number) => {
      const dt = Math.min(50, t - lastT);
      lastT = t;
      ctx.fillStyle = 'rgba(10, 5, 24, 0.28)';
      ctx.fillRect(0, 0, w, h);
      const maxR = Math.max(w, h) * 0.7;

      for (const s of stars) {
        s.z -= SPEED * (dt / 16);
        if (s.z <= 0) {
          s.x = (Math.random() - 0.5) * 2;
          s.y = (Math.random() - 0.5) * 2;
          s.z = 1;
          s.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        const scale = 1 / s.z;
        const px = cx + s.x * scale * maxR;
        const py = cy + s.y * scale * maxR;
        if (px < -50 || px > w + 50 || py < -50 || py > h + 50) continue;

        const prevScale = 1 / Math.min(1, s.z + SPEED * 4);
        const ppx = cx + s.x * prevScale * maxR;
        const ppy = cy + s.y * prevScale * maxR;

        const dpr = window.devicePixelRatio;
        const size = (1 - s.z) * 2.5 * dpr;
        const alpha = Math.min(1, (1 - s.z) * 1.5);
        s.twinkle += 0.06;
        const twink = 0.7 + Math.sin(s.twinkle) * 0.3;

        ctx.strokeStyle = s.color;
        ctx.globalAlpha = alpha * 0.55;
        ctx.lineWidth = size * 0.7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ppx, ppy);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.globalAlpha = alpha * twink;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();

        if (s.z < 0.4) {
          ctx.globalAlpha = alpha * 0.25;
          ctx.beginPath();
          ctx.arc(px, py, size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      running = false;
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}

export function AuthPage() {
  const location = useLocation();
  const initial = (location.state ?? null) as {
    mode?: 'login' | 'signup' | 'forgot' | 'reset';
    email?: string;
  } | null;
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(
    initial?.mode ?? 'login',
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, signup } = useAuth();

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthLabel =
    strength <= 1
      ? t('auth.strength.weak')
      : strength === 2
        ? t('auth.strength.medium')
        : t('auth.strength.strong');
  const strengthClass = strength === 1 ? 'weak' : strength === 2 ? 'medium' : 'strong';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (mode === 'login') {
        await login({ email, password });
        navigate('/');
      } else if (mode === 'signup') {
        await signup({ name, email, password });
        navigate('/welcome');
      } else if (mode === 'forgot') {
        await forgotPassword(email);
        setSuccess(t('auth.successForgot'));
        setMode('reset');
      } else if (mode === 'reset') {
        await resetPassword(email, code, password);
        setSuccess(t('auth.successReset'));
        setCode('');
        setPassword('');
        setMode('login');
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError(t('auth.serverError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: 'login' | 'signup' | 'forgot' | 'reset') => {
    setMode(m);
    setError('');
    setSuccess('');
  };

  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: .5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: .9; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-fade-up { animation: fadeUp 0.4s ease; }
        .pw-bar { flex: 1; height: 3px; border-radius: 2px; background: var(--bg3); transition: background 0.3s; }
        .pw-bar.weak { background: var(--error); }
        .pw-bar.medium { background: var(--warning); }
        .pw-bar.strong { background: var(--success); }
      `}</style>

      <div
        className="relative flex h-screen text-[var(--text)] overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, #1a0d3d 0%, #0a0518 55%, #000 100%)',
        }}
      >
        {/* Cosmic background — full screen, behind both panels (visible on mobile too) */}
        {/* Pulsing accent glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse-glow 8s ease-in-out infinite',
            zIndex: 1,
          }}
        />
        {/* Canvas starfield */}
        <Starfield />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at center, rgba(10,5,24,.55) 0%, transparent 75%)',
            zIndex: 3,
          }}
        />

        {/* Left brand panel (desktop only) */}
        <div className="hidden min-[900px]:flex flex-1 flex-col justify-center items-center relative z-[4]">
          {/* Brand content */}
          <div className="relative max-w-[400px] text-center" style={{ zIndex: 4 }}>
            <div className="flex items-center justify-center gap-3 mb-8">
              <svg
                className="w-10 h-10"
                viewBox="0 0 64 64"
                style={{ filter: 'drop-shadow(0 0 16px var(--accent-glow))' }}
              >
                <polygon
                  points="32,4 39,24 60,24 43,37 49,58 32,46 15,58 21,37 4,24 25,24"
                  fill="var(--accent)"
                />
              </svg>
              <span className="text-[32px] font-bold" style={{ letterSpacing: '-1px' }}>
                CyberStars
              </span>
            </div>
            <p className="text-lg text-[var(--text2)] leading-relaxed mb-10">
              {t('auth.brand.tagline')}
            </p>
            <div className="flex flex-col gap-4 text-left">
              {['⌨️', '💻', '🏆', '💬', '📰', '🚀'].map((icon, i) => {
                const f = {
                  icon,
                  bold: t(`auth.features.${i}.bold`),
                  rest: t(`auth.features.${i}.rest`),
                };
                return (
                  <div key={f.bold} className="flex items-center gap-3 text-sm text-[var(--text2)]">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{
                        background: 'rgba(34,34,46,.55)',
                        border: '1px solid rgba(108,92,231,.35)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {f.icon}
                    </div>
                    <span>
                      <strong className="text-[var(--text)]">{f.bold}</strong>
                      {f.rest}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="relative z-[4] w-full min-[900px]:w-[460px] min-[900px]:flex-shrink-0 bg-[rgba(13,10,24,0.6)] backdrop-blur-[10px] min-[900px]:bg-[var(--bg2)] min-[900px]:backdrop-blur-none border-l border-[var(--border)] flex flex-col justify-center px-6 sm:px-12 py-12 overflow-y-auto">
          {/* Tabs — only shown for login/signup */}
          <>
            {(mode === 'login' || mode === 'signup') && (
              <div className="flex mb-8 bg-[var(--bg3)] rounded-[var(--radius)] p-1">
                <button
                  onClick={() => switchMode('login')}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-[var(--radius-sm)] transition-all cursor-pointer border-none ${
                    mode === 'login'
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-transparent text-[var(--text3)] hover:text-[var(--text)]'
                  }`}
                  style={mode === 'login' ? { boxShadow: '0 2px 8px #6C5CE744' } : undefined}
                >
                  {t('auth.tabs.login')}
                </button>
                <button
                  onClick={() => switchMode('signup')}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-[var(--radius-sm)] transition-all cursor-pointer border-none ${
                    mode === 'signup'
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-transparent text-[var(--text3)] hover:text-[var(--text)]'
                  }`}
                  style={mode === 'signup' ? { boxShadow: '0 2px 8px #6C5CE744' } : undefined}
                >
                  {t('auth.tabs.signup')}
                </button>
              </div>
            )}

            {(mode === 'forgot' || mode === 'reset') && (
              <div className="mb-8">
                <button
                  onClick={() => switchMode('login')}
                  className="text-[13px] text-[var(--accent)] bg-transparent border-none cursor-pointer hover:underline mb-3 flex items-center gap-1"
                >
                  {t('auth.backToLogin')}
                </button>
                <h2 className="text-xl font-bold text-[var(--text)] m-0">
                  {mode === 'forgot' ? t('auth.forgotTitle') : t('auth.resetTitle')}
                </h2>
                <p className="text-sm text-[var(--text3)] mt-1 mb-0">
                  {mode === 'forgot' ? t('auth.forgotSubtitle') : t('auth.resetSubtitle')}
                </p>
              </div>
            )}

            {success && (
              <p className="text-[var(--success)] text-center text-sm font-semibold mb-4">
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-[var(--text2)] mb-1.5 tracking-[0.5px]">
                    {t('auth.displayName')}
                  </label>
                  <input
                    type="text"
                    placeholder={t('auth.displayNamePlaceholder')}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-[11px] px-[14px] bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text)] text-sm outline-none transition-all placeholder:text-[var(--text3)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)]"
                  />
                </div>
              )}

              {mode !== 'reset' && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-[var(--text2)] mb-1.5 tracking-[0.5px]">
                    {t('auth.email')}
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-[11px] px-[14px] bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text)] text-sm outline-none transition-all placeholder:text-[var(--text3)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)]"
                  />
                </div>
              )}

              {mode === 'reset' && <input type="hidden" autoComplete="username" value={email} />}

              {mode === 'reset' && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-[var(--text2)] mb-1.5 tracking-[0.5px]">
                    {t('auth.resetCode')}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder={t('auth.resetCodePlaceholder')}
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full py-[11px] px-[14px] bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text)] text-sm outline-none transition-all placeholder:text-[var(--text3)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)] text-center tracking-[6px] text-lg font-mono"
                  />
                </div>
              )}

              {mode !== 'forgot' && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-[var(--text2)] mb-1.5 tracking-[0.5px]">
                    {mode === 'reset' ? t('auth.newPassword') : t('auth.password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      autoComplete={
                        mode === 'reset'
                          ? 'new-password'
                          : mode === 'signup'
                            ? 'new-password'
                            : 'current-password'
                      }
                      placeholder={
                        mode === 'signup'
                          ? t('auth.passwordPlaceholderSignup')
                          : mode === 'reset'
                            ? t('auth.passwordPlaceholderReset')
                            : t('auth.passwordPlaceholderLogin')
                      }
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-[11px] px-[14px] pr-10 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[var(--text)] text-sm outline-none transition-all placeholder:text-[var(--text3)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)]"
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-[var(--text3)]"
                      onClick={() => setShowPw(!showPw)}
                    >
                      {showPw ? '🙈' : '👁️'}
                    </span>
                  </div>
                  {(mode === 'signup' || mode === 'reset') && password.length > 0 && (
                    <>
                      <div className="flex gap-1 mt-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className={`pw-bar ${strength >= i ? strengthClass : ''}`} />
                        ))}
                      </div>
                      <div className="text-[11px] text-[var(--text3)] mt-1">{strengthLabel}</div>
                    </>
                  )}
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-between mb-6">
                  <label className="flex items-center gap-2 text-[13px] text-[var(--text2)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="accent-[var(--accent)] w-4 h-4"
                    />
                    {t('auth.rememberMe')}
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-[13px] text-[var(--accent)] bg-transparent border-none cursor-pointer hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </div>
              )}

              {error && (
                <p className="text-[var(--error)] text-center text-sm font-semibold mb-4">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-[13px] rounded-[var(--radius)] bg-[var(--accent)] text-white text-[15px] font-semibold cursor-pointer border-none transition-all relative overflow-hidden hover:brightness-110 disabled:opacity-80 disabled:pointer-events-none"
                style={!loading ? { boxShadow: undefined } : undefined}
              >
                {loading ? (
                  <span
                    className="inline-block w-[18px] h-[18px] border-2 border-white/25 border-t-white rounded-full align-middle"
                    style={{ animation: 'spin 0.6s linear infinite' }}
                  />
                ) : mode === 'login' ? (
                  t('auth.submitLogin')
                ) : mode === 'signup' ? (
                  t('auth.submitSignup')
                ) : mode === 'forgot' ? (
                  t('auth.submitForgot')
                ) : (
                  t('auth.submitReset')
                )}
              </button>
            </form>

            <div className="text-center text-[13px] text-[var(--text3)] mt-5">
              {mode === 'login' ? (
                <span>
                  {t('auth.noAccount')}{' '}
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-[var(--accent)] bg-transparent border-none cursor-pointer hover:underline"
                  >
                    {t('auth.signUpFree')}
                  </button>
                </span>
              ) : mode === 'signup' ? (
                <span>
                  {t('auth.haveAccount')}{' '}
                  <button
                    onClick={() => switchMode('login')}
                    className="text-[var(--accent)] bg-transparent border-none cursor-pointer hover:underline"
                  >
                    {t('auth.logIn')}
                  </button>
                </span>
              ) : null}
            </div>
          </>
        </div>
      </div>
    </>
  );
}
