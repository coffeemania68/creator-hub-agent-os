import { Bell, HelpCircle, Menu, Search } from 'lucide-react';
import type { AppRoute } from '../../app/routes';

type TopBarProps = {
  currentRoute: AppRoute;
};

export function TopBar({ currentRoute }: TopBarProps) {
  const isPMWorkspace = currentRoute.path === '/pm';

  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-surface-base/80 px-4 py-3 backdrop-blur sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink-muted lg:hidden">
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            {!isPMWorkspace ? <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-primary">{currentRoute.eyebrow}</p> : null}
            <h1 className="truncate text-xl font-black text-ink sm:text-2xl">{currentRoute.title}</h1>
          </div>
        </div>

        <div className="hidden min-w-[260px] max-w-md flex-1 items-center gap-2 rounded-xl border border-line/70 bg-white px-3 py-2 text-sm text-ink-soft shadow-ambient md:flex">
          <Search size={17} />
          <span>Search projects, commands, artifacts</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink-muted transition hover:text-primary">
            <Bell size={18} />
          </button>
          <button className="focus-ring hidden h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink-muted transition hover:text-primary sm:inline-flex">
            <HelpCircle size={18} />
          </button>
          {!isPMWorkspace ? <div className="hidden items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-primary-action shadow-[0_0_0_4px_rgba(45,212,191,0.14)]" />
            <span className="text-xs font-bold text-ink-muted">PM Always On</span>
          </div> : null}
        </div>
      </div>
    </header>
  );
}
