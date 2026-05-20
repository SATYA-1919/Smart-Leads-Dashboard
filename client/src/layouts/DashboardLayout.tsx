import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils/cn';
import { Logo } from '@/components/ui/Logo';
import { LogoutIcon, MoonIcon, SunIcon, ShieldIcon, UserIcon } from '@/components/ui/icons';

export function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 sm:gap-10">
            <NavLink to="/" className="flex items-center">
              <Logo />
            </NavLink>
            <nav className="hidden gap-1 sm:flex">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-1.5 text-sm font-semibold transition',
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                  )
                }
              >
                Leads
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {user && (
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
                  {initials(user.name)}
                </span>
                <div className="hidden text-left text-xs leading-tight sm:block">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {user.name}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    {user.role === 'Admin' ? (
                      <ShieldIcon className="h-3 w-3" />
                    ) : (
                      <UserIcon className="h-3 w-3" />
                    )}
                    {user.role}
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              className="btn-ghost px-2.5"
              onClick={handleLogout}
              title="Sign out"
            >
              <LogoutIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
