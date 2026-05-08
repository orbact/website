import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "", ...props }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      {...props}
    >
      {/* 
        Geometric ring with a precise 50-degree cut centered at the top-left (225°).
        Center: 50,50
        Radius: 34
        Stroke: 28
        Start Angle: 250° (x=38.4, y=18.1)
        End Angle: 200° (x=18.1, y=38.4)
      */}
      <path 
        d="M 38.4 18.1 A 34 34 0 1 1 18.1 38.4"
        stroke="currentColor" 
        strokeWidth="28" 
        strokeLinecap="butt"
      />
    </svg>
  );
};

export default Logo;