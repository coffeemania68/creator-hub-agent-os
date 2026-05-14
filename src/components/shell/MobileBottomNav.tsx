import type { AppRoute } from '../../app/routes';

type MobileBottomNavProps = {
  currentRoute: AppRoute;
  routes: AppRoute[];
  onNavigate: (path: string) => void;
};

const visibleMobileRoutes = ['/dashboard', '/projects', '/pm', '/commands', '/settings'];

export function MobileBottomNav({ currentRoute, routes, onNavigate }: MobileBottomNavProps) {
  const mobileRoutes = visibleMobileRoutes
    .map((path) => routes.find((route) => route.path === path))
    .filter((route): route is AppRoute => Boolean(route));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-white/95 px-2 pb-2 pt-1 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {mobileRoutes.map((route) => {
          const Icon = route.icon;
          const isActive = route.path === currentRoute.path;

          return (
            <button
              className={`focus-ring flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-bold transition ${
                isActive ? 'bg-primary-soft text-primary' : 'text-ink-soft hover:bg-surface-low'
              }`}
              key={route.path}
              onClick={() => onNavigate(route.path)}
              type="button"
            >
              <Icon size={19} />
              <span className="truncate">{route.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
