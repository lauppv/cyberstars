import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useTutor } from '../../context/TutorContext';
import { TutorPanel } from '../tutor/TutorPanel';
import { TutorWelcomeBack } from '../tutor/TutorWelcomeBack';
import { RunWaitNotice } from '../code/RunWaitNotice';
import { Sidebar, type SidebarState } from './Sidebar';

// Above this width the sidebar pushes the page aside. Below it there is no room
// for that, so it slides over the page as a drawer and waits to be asked for.
const WIDE = '(min-width: 768px)';

const STORAGE_KEY = 'cyberstars.sidebar';

// Routes that paint the whole screen themselves and carry no app chrome.
const BARE_ROUTES = new Set(['/getstarted', '/placement', '/interests', '/laniakea']);

const ROOM: Record<SidebarState, string> = {
  open: 'md:pl-[240px]',
  wide: 'md:pl-[240px]',
  closed: '',
};

// The tutor's panel (400px) and its history (240px more) push the page aside
// like the sidebar does, as long as that leaves the page about 360px, so a
// step later with the sidebar open. Below that they lie over the page, and on
// a phone the panel takes the whole screen
function tutorRoom(sidebar: SidebarState, history: boolean): string {
  if (sidebar === 'closed') return history ? 'md:pr-[400px] lg:pr-[640px]' : 'md:pr-[400px]';
  return history ? 'lg:pr-[400px] xl:pr-[640px]' : 'lg:pr-[400px]';
}

interface SidebarControl {
  state: SidebarState;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarControl | null>(null);

/** The sidebar's state and toggle, or null outside the shell (bare routes, tests). */
// eslint-disable-next-line react-refresh/only-export-components
export function useSidebar(): SidebarControl | null {
  return useContext(SidebarContext);
}

function readRemembered(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'closed';
  } catch {
    return true;
  }
}

function isWide(): boolean {
  return window.matchMedia(WIDE).matches;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { isLoggedIn, isLoading } = useAuth();
  const tutor = useTutor();
  const tutorOpen = tutor?.open ?? false;
  const [remembered] = useState(readRemembered);
  const [toggled, setToggled] = useState<boolean | null>(null);

  // Until the button is used, a remembered sidebar only unfolds on a wide
  // screen. Leaving that to a media query rather than a measurement means a
  // phone opens on the page itself, with nothing sliding into place on load
  const state: SidebarState =
    toggled === null ? (remembered ? 'wide' : 'closed') : toggled ? 'open' : 'closed';

  function toggle() {
    const shown = state === 'open' || (state === 'wide' && isWide());
    setToggled(!shown);
    try {
      localStorage.setItem(STORAGE_KEY, shown ? 'closed' : 'open');
    } catch {
      // storage may be blocked, the toggle still works for this visit
    }
  }

  // A drawer left standing over the page it just opened would be in the way.
  // On a wide screen the sidebar sits beside the page, so it stays
  function leave() {
    if (!isWide()) setToggled(false);
  }

  // The page under an open drawer holds still (the stylesheet does that only
  // where it is a drawer, so turning the phone keeps it right), and Escape closes it
  useEffect(() => {
    if (state !== 'open') return;
    const root = document.documentElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isWide()) setToggled(false);
    };
    root.dataset.drawer = 'open';
    document.addEventListener('keydown', onKey);
    return () => {
      delete root.dataset.drawer;
      document.removeEventListener('keydown', onKey);
    };
  }, [state]);

  // Home is the welcome page for a visitor and the dashboard for a student, so
  // the address alone can't decide. Stay bare until we know who's there, or a
  // visitor would see the sidebar flash in and out after a reload
  const visitorHome = pathname === '/' && (isLoading || !isLoggedIn);

  if (BARE_ROUTES.has(pathname) || visitorHome) return <>{children}</>;

  return (
    <SidebarContext.Provider value={{ state, toggle }}>
      {/* A finger lifted beside the drawer closes it, after a swipe too, which
          never ends in a click. Its click is cancelled, so it can't land on
          the page once the backdrop is gone */}
      {state === 'open' && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setToggled(false)}
          onTouchEnd={(e) => {
            e.preventDefault();
            setToggled(false);
          }}
          className="md:hidden fixed inset-0 z-40 bg-black/50 border-none cursor-default"
        />
      )}
      <Sidebar state={state} onNavigate={leave} />
      <div
        className={`@container min-h-full transition-[padding] duration-200 ${ROOM[state]} ${
          tutorOpen ? tutorRoom(state, tutor?.historyOpen ?? false) : ''
        }`}
      >
        {children}
      </div>
      {tutorOpen && <TutorPanel />}
      <TutorWelcomeBack />
      <RunWaitNotice />
    </SidebarContext.Provider>
  );
}
