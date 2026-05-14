import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '../components/shell/AppShell';
import { fallbackRoute, getRoute, renderRoute, routes } from './routes';

function useCurrentPath() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const syncPath = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', syncPath);

    return () => window.removeEventListener('popstate', syncPath);
  }, []);

  return pathname;
}

export function App() {
  const pathname = useCurrentPath();
  const currentRoute = useMemo(() => getRoute(pathname), [pathname]);

  useEffect(() => {
    if (pathname === '/') {
      window.history.replaceState({}, '', fallbackRoute.path);
    }
  }, [pathname]);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <AppShell currentRoute={currentRoute} routes={routes} onNavigate={navigate}>
      {renderRoute(currentRoute)}
    </AppShell>
  );
}
