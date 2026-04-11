import { NavLink, useLocation } from 'react-router-dom';
import { DiceModal } from '../dice/DiceModal';
import { playClick } from '../../utils/sounds';
import { useT } from '../../i18n';
import './AppShell.css';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const T = useT();
  const isEditor = location.pathname.startsWith('/new') || location.pathname.startsWith('/edit');

  const NAV_ITEMS = [
    { path: '/', label: T.nav.journal,  icon: '◈' },
    { path: '/new', label: T.nav.newEntry, icon: '⊕', accent: true },
    { path: '/skills', label: T.nav.skills,   icon: '◉' },
    { path: '/settings', label: T.nav.settings, icon: '◎' },
  ];

  return (
    <div className="app-shell">
      <main className="app-shell__main">
        {children}
      </main>

      {!isEditor && (
        <nav className="app-shell__nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item--active' : ''} ${item.accent ? 'nav-item--accent' : ''}`
              }
              onClick={playClick}
            >
              <span className="nav-item__icon">{item.icon}</span>
              <span className="nav-item__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      )}

      <DiceModal />
    </div>
  );
}
