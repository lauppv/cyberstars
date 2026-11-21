import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
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
  setFloating: (on: boolean) => void;
}

const SidebarContext = createContext<SidebarControl | null>(null);

/** The sidebar's state and toggle, or null outside the shell (bare routes, tests). */
// eslint-disable-next-line react-refresh/only-export-components
export function useSidebar(): SidebarControl | null {
  return useContext(SidebarContext);
}

/**
 * While `on`, the sidebar floats: it starts closed, opens over the page
 * instead of pushing it aside, and closes again once a row is picked or the
 * student clicks beside it. Dev mode's window holds the whole screen, so the
 * sidebar is only wanted there to go somewhere else, not to stay open beside
 * the lesson.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useFloatingSidebar(on: boolean) {
  const setFloating = useContext(SidebarContext)?.setFloating;
  useEffect(() => {
    if (!on || !setFloating) return;
    setFloating(true);
    return () => setFloating(false);
  }, [on, setFloating]);
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
  const { isLoggedIn, isLoading, user } = useAuth();
  const tutor = useTutor();
  const tutorOpen = tutor?.open ?? false;
  const [remembered] = useState(readRemembered);
  const [toggled, setToggled] = useState<boolean | null>(null);
  const [floating, setFloatingState] = useState(false);
  const [floatOpen, setFloatOpen] = useState(false);
  // Each float starts closed, whatever the sidebar was before or last time
  const setFloating = useCallback((on: boolean) => {
    setFloatingState(on);
    setFloatOpen(false);
  }, []);

  // Until the button is used, a remembered sidebar only unfolds on a wide
  // screen. Leaving that to a media query rather than a measurement means a
  // phone opens on the page itself, with nothing sliding into place on load
  const remembers: SidebarState =
    toggled === null ? (remembered ? 'wide' : 'closed') : toggled ? 'open' : 'closed';
  const chosen: SidebarState = floating ? (floatOpen ? 'open' : 'closed') : remembers;
  // A new account held on the tour lesson (TourGate) gets no sidebar, so it
  // has no way off it
  const state: SidebarState = user && !user.onboardedAt ? 'closed' : chosen;

  function toggle() {
    // A floating sidebar's opening is not the one the shell remembers
    if (floating) {
      setFloatOpen((was) => !was);
      return;
    }
    const shown = state === 'open' || (state === 'wide' && isWide());
    setToggled(!shown);
    try {
      localStorage.setItem(STORAGE_KEY, shown ? 'closed' : 'open');
    } catch {
      // storage may be blocked, the toggle still works for this visit
    }
  }

  function close() {
    if (floating) setFloatOpen(false);
    else setToggled(false);
  }

  // A drawer left standing over the page it just opened would be in the way.
  // On a wide screen the sidebar sits beside the page, so it stays
  function leave() {
    if (floating || !isWide()) close();
  }

  // The page under an open drawer holds still (the stylesheet does that only
  // where it is a drawer, so turning the phone keeps it right), and Escape
  // closes it, as it does a floating sidebar at any width
  useEffect(() => {
    if (state !== 'open') return;
    const root = document.documentElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (floating) setFloatOpen(false);
      else if (!isWide()) setToggled(false);
    };
    root.dataset.drawer = 'open';
    document.addEventListener('keydown', onKey);
    return () => {
      delete root.dataset.drawer;
      document.removeEventListener('keydown', onKey);
    };
  }, [state, floating]);

  // Home is the welcome page for a visitor and the dashboard for a student, so
  // the address alone can't decide. Stay bare until we know who's there, or a
  // visitor would see the sidebar flash in and out after a reload
  const visitorHome = pathname === '/' && (isLoading || !isLoggedIn);

  if (BARE_ROUTES.has(pathname) || visitorHome) return <>{children}</>;

  // A floating sidebar lies over the page, so the page keeps its room
  const room: SidebarState = floating ? 'closed' : state;

  return (
    <SidebarContext.Provider value={{ state, toggle, setFloating }}>
      {/* A finger lifted beside the drawer closes it, after a swipe too, which
          never ends in a click; so does a click beside a floating sidebar.
          Its click is cancelled, so it can't land on the page once the
          backdrop is gone */}
      {state === 'open' && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
          onTouchEnd={(e) => {
            e.preventDefault();
            close();
          }}
          className={`${floating ? 'z-[65]' : 'md:hidden z-40'} fixed inset-0 overlay border-none cursor-default`}
        />
      )}
      <Sidebar state={state} floating={floating} onNavigate={leave} />
      <div
        className={`@container min-h-full transition-[padding] duration-200 ${ROOM[room]} ${
          tutorOpen ? tutorRoom(room, tutor?.historyOpen ?? false) : ''
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
