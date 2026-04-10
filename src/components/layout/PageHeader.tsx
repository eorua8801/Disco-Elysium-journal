import { useNavigate } from 'react-router-dom';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backPath?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, backPath, actions }: PageHeaderProps) {
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
          <h1 className="page-header__title">{title}</h1>
          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}
