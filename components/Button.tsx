import React, { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon = false, className = '', ...props }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    
    // Magnetic Pull Calculation
    const x = (e.clientX - left - width / 2) * 0.2;
    const y = (e.clientY - top - height / 2) * 0.2;
    
    setPosition({ x, y });
    setGlowPos({ x: e.clientX - left, y: e.clientY - top });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setGlowPos({ x: 0, y: 0 });
  };

  const baseStyles = "relative inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold transition-all duration-300 ease-out group";
  
  const variants = {
    primary: "bg-text-main text-bg-page shadow-[0_0_20px_rgba(var(--shadow-rgb),0.2)] hover:shadow-[0_0_30px_rgba(var(--shadow-rgb),0.4)] border border-transparent",
    secondary: "bg-accent-primary text-text-inverted hover:bg-accent-primary/90 shadow-[0_0_20px_rgba(var(--accent-primary-rgb),0.4)] border border-transparent",
    outline: "bg-transparent text-text-main border border-border-subtle hover:border-text-main backdrop-blur-sm",
  };

  return (
    <button
      ref={btnRef}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Use translate3d for GPU acceleration
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      {...props}
    >
      {/* Hover Glow Effect */}
      {variant !== 'primary' && (
        <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full"
            style={{
                background: `radial-gradient(100px circle at ${glowPos.x}px ${glowPos.y}px, var(--spotlight-color), transparent 100%)`
            }}
        />
      )}
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
      </span>
    </button>
  );
};

export default Button;