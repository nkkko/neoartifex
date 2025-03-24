'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import textures from 'textures';
import * as d3 from 'd3';

// Define texture types
export type TextureType = 'lines' | 'circles' | 'paths' | 'dots';

// Define context shape
interface TextureContextType {
  getTextureUrl: (type: TextureType) => string;
}

// Create context
const TextureContext = createContext<TextureContextType | null>(null);

// Define props
interface TextureProviderProps {
  children: React.ReactNode;
}

export function TextureProvider({ children }: TextureProviderProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [textureUrls, setTextureUrls] = useState<Record<TextureType, string>>({
    lines: '',
    circles: '',
    paths: '',
    dots: ''
  });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined' || initialized) return;

    // Create SVG element if it doesn't exist
    if (!svgRef.current) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');
      svg.style.position = 'absolute';
      svg.style.visibility = 'hidden';
      document.body.appendChild(svg);
      svgRef.current = svg;
    }

    // Create d3 selection for SVG
    const svgSelection = d3.select(svgRef.current);

    // Create textures
    const linesTexture = textures
      .lines()
      .size(10)
      .strokeWidth(1)
      .stroke('#000000')
      .background('transparent');

    const circlesTexture = textures
      .circles()
      .size(10)
      .radius(2)
      .fill('none')
      .strokeWidth(1)
      .stroke('#000000')
      .background('transparent');

    const pathsTexture = textures
      .paths()
      .d('woven')
      .size(12)
      .strokeWidth(1)
      .stroke('#000000')
      .background('transparent');

    const dotsTexture = textures
      .circles()
      .size(10)
      .radius(1.5)
      .fill('#000000')
      .background('transparent');

    // Apply textures to SVG
    svgSelection.call(linesTexture);
    svgSelection.call(circlesTexture);
    svgSelection.call(pathsTexture);
    svgSelection.call(dotsTexture);

    // Store URLs
    setTextureUrls({
      lines: linesTexture.url(),
      circles: circlesTexture.url(),
      paths: pathsTexture.url(),
      dots: dotsTexture.url()
    });

    setInitialized(true);

    // Cleanup
    return () => {
      if (svgRef.current && svgRef.current.parentNode) {
        svgRef.current.parentNode.removeChild(svgRef.current);
      }
    };
  }, [initialized]);

  // Context value
  const value = {
    getTextureUrl: (type: TextureType) => textureUrls[type] || ''
  };

  return (
    <TextureContext.Provider value={value}>
      {children}
    </TextureContext.Provider>
  );
}

// Custom hook to use textures
export function useTexture(type: TextureType): string {
  const context = useContext(TextureContext);
  
  if (!context) {
    throw new Error('useTexture must be used within a TextureProvider');
  }
  
  return context.getTextureUrl(type);
}