import type { PropsWithChildren } from 'react';
import type { AppRoute } from '../../app/routes';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileBottomNav } from './MobileBottomNav';

type AppShellProps = PropsWithChildren<{
  currentRoute: AppRoute;
  routes: AppRoute[];
  onNavigate: (path: string) => void;
}>;

export function AppShell({ children, currentRoute, routes, onNavigate }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface-base text-ink">
      <div className="flex min-h-screen">
        <Sidebar currentRoute={currentRoute} routes={routes} onNavigate={onNavigate} />

        <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
          <TopBar currentRoute={currentRoute} />
          <main className="flex min-h-0 flex-1">{children}</main>
        </div>
      </div>

      <MobileBottomNav currentRoute={currentRoute} routes={routes} onNavigate={onNavigate} />
    </div>
  );
}
