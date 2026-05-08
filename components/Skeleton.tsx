import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

/**
 * Skeleton loader component for improved loading states
 * Matches the site's design system with glassmorphism effect
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animate = true,
}) => {
  const baseClasses = 'bg-bg-surface/50 backdrop-blur-sm';
  const animationClass = animate ? 'animate-pulse' : '';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const style: React.CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClass} ${className}`}
      style={style}
      role="progressbar"
      aria-label="Loading..."
    />
  );
};

// Pre-built skeleton patterns for common use cases

interface CardSkeletonProps {
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ className = '' }) => (
  <div className={`bg-bg-card border border-border-subtle rounded-[24px] overflow-hidden ${className}`}>
    {/* Image placeholder */}
    <Skeleton variant="rectangular" height={200} animate />
    
    {/* Content */}
    <div className="p-6 space-y-4">
      {/* Badge */}
      <Skeleton variant="rounded" width={100} height={24} />
      
      {/* Title */}
      <Skeleton variant="text" height={28} width="80%" />
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton variant="text" height={16} />
        <Skeleton variant="text" height={16} width="90%" />
        <Skeleton variant="text" height={16} width="70%" />
      </div>
      
      {/* Footer */}
      <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
        <Skeleton variant="text" width={60} height={14} />
        <Skeleton variant="rounded" width={100} height={32} />
      </div>
    </div>
  </div>
);

export const ProjectGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const TextBlockSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        variant="text" 
        width={i === lines - 1 ? '60%' : '100%'} 
      />
    ))}
  </div>
);

export const AvatarSkeleton: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <Skeleton variant="circular" width={size} height={size} />
);

export const ButtonSkeleton: React.FC<{ width?: string | number }> = ({ width = 120 }) => (
  <Skeleton variant="rounded" width={width} height={44} />
);

// Hero section skeleton
export const HeroSkeleton: React.FC = () => (
  <div className="min-h-[60vh] flex items-center pt-36 md:pt-48 pb-12">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="space-y-6">
          {/* Badge */}
          <Skeleton variant="rounded" width={180} height={28} />
          
          {/* Title */}
          <div className="space-y-3">
            <Skeleton variant="text" height={56} width="70%" />
            <Skeleton variant="text" height={56} width="50%" />
          </div>
          
          {/* Description */}
          <div className="space-y-2 pl-6 border-l-2 border-border-subtle">
            <Skeleton variant="text" height={20} />
            <Skeleton variant="text" height={20} width="80%" />
          </div>
          
          {/* Stats */}
          <div className="flex gap-8">
            <div className="space-y-2">
              <Skeleton variant="text" width={80} height={32} />
              <Skeleton variant="text" width={100} height={12} />
            </div>
            <div className="space-y-2">
              <Skeleton variant="text" width={80} height={32} />
              <Skeleton variant="text" width={100} height={12} />
            </div>
          </div>
        </div>
        
        {/* 3D Visual placeholder */}
        <div className="flex justify-center lg:justify-end">
          <Skeleton variant="circular" width={320} height={320} className="opacity-50" />
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;
