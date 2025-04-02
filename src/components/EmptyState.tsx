
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
  onAction?: () => void;
}

const EmptyState = ({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12 px-4">
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link to={actionHref}>
            <Button className="bg-yellow-900 hover:bg-yellow-800 text-black">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} className="bg-yellow-900 hover:bg-yellow-800 text-black">
            {actionLabel}
          </Button>
        )
      )}
    </div>
  );
};

export default EmptyState;
