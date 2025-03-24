'use client';

import { useState, useEffect } from 'react';
import { TextureType, useTexture } from './TextureProvider';

interface TexturedBackgroundProps {
  children: React.ReactNode;
  textureType?: TextureType;
  className?: string;
  opacity?: number;
}

export function TexturedBackground({ 
  children, 
  textureType = 'lines',
  className = '',
  opacity = 0.05
}: TexturedBackgroundProps) {
  // Get texture URL from context
  const textureUrl = useTexture(textureType);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // For debugging
  useEffect(() => {
    if (isMounted) {
      console.log(`TexturedBackground mounted with texture: ${textureType}, URL: ${textureUrl}`);
    }
  }, [isMounted, textureType, textureUrl]);
  
  if (!isMounted) {
    return (
      <div className={className}>
        <div>{children}</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
          backgroundImage: textureUrl,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          opacity: opacity,
        }}
        data-texture={textureType}
        aria-hidden="true"
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}