import React from 'react';
import { CheckCircle2, Clock, Eye, Sparkles, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    className: 'badge-warning',
    icon: Clock,
  },
  reviewed: {
    label: 'Reviewed',
    className: 'badge-neutral',
    icon: Eye,
  },
  shortlisted: {
    label: 'Shortlisted',
    className: 'badge-primary',
    icon: Sparkles,
  },
  accepted: {
    label: 'Accepted',
    className: 'badge-success',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    className: 'badge-error',
    icon: XCircle,
  },
};

const ApplicationStatusBadge = ({ status = 'pending' }) => {
  const normalized = (status || 'pending').toLowerCase();
  const config = STATUS_CONFIG[normalized] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  );
};

export default ApplicationStatusBadge;

