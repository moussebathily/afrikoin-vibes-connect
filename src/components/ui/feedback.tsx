
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({
  type,
  message,
  className,
  dismissible = false,
  onDismiss
}) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      'flex items-center p-4 mb-4 text-sm border rounded-lg animate-fade-in',
      styles[type],
      className
    )}>
      <Icon className="flex-shrink-0 w-4 h-4 mr-3" />
      <span className="flex-1">{message}</span>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
        >
          <span className="sr-only">Dismiss</span>
          <XCircle className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default Feedback;
