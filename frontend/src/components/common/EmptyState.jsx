import React from 'react';
import { Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are currently no records to display.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div
      className="card"
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1.5rem 0',
      }}
    >
      <div
        className="category-icon-wrapper"
        style={{ width: '64px', height: '64px', marginBottom: '1.25rem', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
      >
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '1.5rem', fontSize: '0.9375rem' }}>
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText}
        </Link>
      )}

      {actionText && onAction && !actionLink && (
        <button type="button" onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

