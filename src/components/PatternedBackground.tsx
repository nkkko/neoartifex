'use client';

import React from 'react';

type PatternType = 'dots' | 'grid';

interface PatternedBackgroundProps {
  children: React.ReactNode;
  pattern?: PatternType;
  className?: string;
  patternColor?: string;
  opacity?: number;
}

export function PatternedBackground({
  children,
  pattern = 'lines',
  className = '',
  patternColor = 'currentColor',
  opacity = 0.1
}: PatternedBackgroundProps) {
  const patternStyles = React.useMemo(() => {
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(${patternColor} 2px, transparent 2px)`,
          backgroundSize: '20px 20px'
        };
      case 'grid':
        return {
          backgroundImage: `linear-gradient(${patternColor} 1px, transparent 1px), 
                           linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        };
      default:
        return {};
    }
  }, [pattern, patternColor]);

  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          opacity,
          ...patternStyles
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}