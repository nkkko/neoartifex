'use client';

import { useEffect, useState } from 'react';
import { useTexture } from './TextureProvider';

export function TextureDebug() {
  const [mounted, setMounted] = useState(false);
  const linesUrl = useTexture('lines');
  const circlesUrl = useTexture('circles');
  const pathsUrl = useTexture('paths');
  const dotsUrl = useTexture('dots');
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white p-4 text-xs z-50 max-w-xs overflow-auto">
      <h3 className="font-bold mb-2">Texture Debug</h3>
      <div>
        <p>Lines: {linesUrl || 'Not loaded'}</p>
        <p>Circles: {circlesUrl || 'Not loaded'}</p>
        <p>Paths: {pathsUrl || 'Not loaded'}</p>
        <p>Dots: {dotsUrl || 'Not loaded'}</p>
      </div>
      
      <hr className="my-2" />
      
      <h4 className="font-bold mb-2">Preview:</h4>
      <div className="flex flex-col gap-2">
        <div className="h-10 w-full" style={{ backgroundImage: linesUrl, backgroundRepeat: 'repeat' }}>
          <span className="sr-only">Lines texture</span>
        </div>
        <div className="h-10 w-full" style={{ backgroundImage: circlesUrl, backgroundRepeat: 'repeat' }}>
          <span className="sr-only">Circles texture</span>
        </div>
        <div className="h-10 w-full" style={{ backgroundImage: pathsUrl, backgroundRepeat: 'repeat' }}>
          <span className="sr-only">Paths texture</span>
        </div>
        <div className="h-10 w-full" style={{ backgroundImage: dotsUrl, backgroundRepeat: 'repeat' }}>
          <span className="sr-only">Dots texture</span>
        </div>
      </div>
    </div>
  );
}