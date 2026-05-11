import React, { useRef, useState, useEffect, useCallback } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', onClick, style }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  
  // Physics state
  const requestRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const updatePhysics = useCallback(() => {
    // Linear interpolation (Lerp) for smooth easing
    // 0.1 = speed of smoothing (lower is slower/smoother)
    const lerp = 0.1;
    
    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp;
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp;
    
    // Apply transform via direct DOM manipulation for max performance
    // bypassing React render cycle for 60fps
    if (cardRef.current) {
      const { x, y } = currentRef.current;
      // Only apply if movement is significant enough to notice (micro-optimization)
      if (Math.abs(x) > 0.01 || Math.abs(y) > 0.01) {
        cardRef.current.style.transform = `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale3d(1, 1, 1)`;
      } else if (targetRef.current.x === 0 && targetRef.current.y === 0) {
        // Ensure perfect zeroing when stopped
        cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      }
    }

    requestRef.current = requestAnimationFrame(updatePhysics);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updatePhysics]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Update glow position immediately (visuals)
    setGlowPos({ x, y });
    setOpacity(1);

    // Calculate rotation targets
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Max rotation in degrees
    const MAX_ROTATION = 5;
    
    // Invert X axis for natural tilt feel
    const targetX = ((y - centerY) / centerY) * -MAX_ROTATION;
    const targetY = ((x - centerX) / centerX) * MAX_ROTATION;
    
    targetRef.current = { x: targetX, y: targetY };
  };

  const handleMouseLeave = () => {
    setOpacity(0);
    // Smoothly return to center
    targetRef.current = { x: 0, y: 0 };
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  // Determine if element is interactive for accessibility
  const isInteractive = !!onClick;

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      className={`
        relative transition-opacity duration-500 ease-out transform-style-3d 
        ${isInteractive ? 'cursor-pointer active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page' : ''} 
        ${className}
      `}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      style={{
        ...style,
        willChange: 'transform', // Hint for browser optimization
      }}
    >
      {/* Dynamic Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-500 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${glowPos.x}px ${glowPos.y}px, var(--spotlight-color), transparent 40%)`,
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
