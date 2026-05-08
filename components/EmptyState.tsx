import React from 'react';
import { LucideIcon, Layers, Search, Ghost } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Layers,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-12 rounded-3xl bg-bg-surface/30 border border-border-subtle backdrop-blur-sm border-dashed ${className}`}>
      <div className="w-20 h-20 rounded-full bg-bg-subtle flex items-center justify-center mb-6 relative group">
        <div className="absolute inset-0 rounded-full bg-accent-primary/10 animate-ping opacity-20 group-hover:opacity-40" />
        <Icon size={40} className="text-muted opacity-50 group-hover:opacity-100 group-hover:text-accent-primary transition-all duration-500" />
      </div>
      
      <h3 className="text-xl font-bold text-text-main mb-2 tracking-tight">
        {title}
      </h3>
      
      <p className="text-muted max-w-sm mx-auto mb-8 text-sm leading-relaxed text-balance">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="min-w-[140px]">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
