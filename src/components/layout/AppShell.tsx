import { NavLink, useLocation } from 'react-router-dom';
import { DiceModal } from '../dice/DiceModal';
import './AppShell.css';

const NAV_ITEMS = [
  { path: '/', label: 'Journal', icon: '◈' },
  { path: '/new', label: 'New Entry', icon: '⊕', accent: true },
  { path: '/skills', label: 'Skills', icon: '◉' },
  { path: '/settings', label: 'Settings', icon: '◎' },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/new') || location.pathname.startsWith('/edit');

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
