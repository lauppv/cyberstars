import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { Sidebar, type SidebarState } from './Sidebar';

// Above this width the sidebar pushes the page aside. Below it there is no room
// for that, so it slides over the page as a drawer and waits to be asked for.
const WIDE = '(min-width: 768px)';

const STORAGE_KEY = 'cyberstars.sidebar';

// Routes that paint the whole screen themselves and carry no app chrome.
const BARE_ROUTES = new Set(['/getstarted', '/welcome', '/laniakea']);

const ROOM: Record<SidebarState, string> = {
  open: 'md:pl-[240px]',
  wide: 'md:pl-[240px]',
  closed: '',
};

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

  useEffect(() => {
    if (state !== 'open') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isWide()) setToggled(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [state]);

  if (BARE_ROUTES.has(pathname)) return <>{children}</>;

  return (
    <SidebarContext.Provider value={{ state, toggle }}>
      {state === 'open' && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setToggled(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/50 border-none cursor-default"
        />
      )}
      <Sidebar state={state} onNavigate={leave} />
      <div className={`min-h-full transition-[padding] duration-200 ${ROOM[state]}`}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}
