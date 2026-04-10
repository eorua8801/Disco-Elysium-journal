import { useNavigate } from 'react-router-dom';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  backPath?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon, backPath, actions }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="page-header">
      <div className="page-header__left">
        {backPath && (
          <button className="page-header__back" onClick={() => navigate(backPath)}>
            ←
          </button>
        )}
        <div className="page-header__text">
          {icon && <span className="page-header__icon">{icon}</span>}
          <h1 className="page-header__title">{title}</h1>
        </div>
      </div>
      {subtitle && <span className="page-header__subtitle" style={{ marginLeft: 'auto', marginRight: 8 }}>{subtitle}</span>}
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}
