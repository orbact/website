import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-[32px] overflow-hidden aspect-[4/3] bg-bg-card border border-border-subtle relative group">
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-bg-subtle animate-pulse" />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shine_1.5s_infinite]" />

      {/* Content Placeholders */}
      <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full flex flex-col justify-end h-full">
        <div className="flex justify-between items-end mb-4">
            {/* Tag Skeleton */}
            <div className="h-6 w-24 bg-bg-surface/50 rounded-full animate-pulse"></div>
            {/* Button Skeleton */}
            <div className="w-12 h-12 rounded-full bg-bg-surface/50 animate-pulse"></div>
        </div>
        
        {/* Title Skeleton */}
        <div className="h-10 w-3/4 bg-bg-surface/50 rounded-xl mb-4 animate-pulse"></div>
        
        {/* Description Skeleton */}
        <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-bg-surface/30 rounded-lg animate-pulse"></div>
            <div className="h-4 w-2/3 bg-bg-surface/30 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Stats Skeleton */}
        <div className="flex gap-8 pt-6 border-t border-white/5">
            <div>
                <div className="h-8 w-16 bg-bg-surface/50 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-3 w-12 bg-bg-surface/30 rounded-lg animate-pulse"></div>
            </div>
            <div>
                <div className="h-8 w-16 bg-bg-surface/50 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-3 w-12 bg-bg-surface/30 rounded-lg animate-pulse"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;