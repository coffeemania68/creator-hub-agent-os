import { Plus, Sparkles } from 'lucide-react';
import type { AppRoute } from '../../app/routes';

type SidebarProps = {
  currentRoute: AppRoute;
  routes: AppRoute[];
  onNavigate: (path: string) => void;
};

const navGroups = [
  {
    label: 'Operate',
    paths: ['/dashboard', '/projects', '/pm', '/commands'],
  },
  {
    label: 'Studio OS',
    paths: ['/teams', '/workflows', '/artifacts', '/connections', '/settings'],
  },
];

export function Sidebar({ currentRoute, routes, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden w-[264px] shrink-0 border-r border-line/70 bg-white/85 px-4 py-5 backdrop-blur lg:flex lg:flex-col">
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lift">
          <Sparkles size={22} />
        </div>
        <div>
          <p className="text-lg font-black text-primary">Creator Hub</p>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">Agent OS</p>
        </div>
      </div>

      <button className="focus-ring mb-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-lift transition hover:bg-primary/90">
        <Plus size={18} />
        Quick Production Brief
      </button>

      <nav className="space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.16em] text-ink-soft">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.paths
                .map((path) => routes.find((route) => route.path === path))
                .filter((route): route is AppRoute => Boolean(route))
                .map((route) => {
                  const Icon = route.icon;
                  const isActive = route.path === currentRoute.path;

                  return (
                    <button
                      className={`focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                        isActive ? 'bg-primary-soft text-primary' : 'text-ink-muted hover:bg-surface-low hover:text-ink'
                      }`}
                      key={route.path}
                      onClick={() => onNavigate(route.path)}
                      type="button"
                    >
                      <Icon size={18} />
                      <span className="min-w-0 flex-1 truncate">{route.label}</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.08em] text-ink-soft">
                        {route.phase.replace('Phase ', 'P')}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-line/70 bg-surface-low p-4">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-ink-soft">OS Mode</p>
        <div className="mt-3 space-y-2 text-xs font-semibold text-ink-muted">
          <div className="flex items-center justify-between gap-3">
            <span>PM Supervisor</span>
            <span className="rounded-full border border-primary-action/30 bg-primary-soft px-2 py-0.5 text-[10px] font-black text-primary">
              Always On
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Data Boundary</span>
            <span className="rounded-full border border-line bg-white px-2 py-0.5 text-[10px] font-black text-ink-soft">
              Mock UI
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
