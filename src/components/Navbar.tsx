'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Youtube, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              NeoArtifex
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`hover:text-primary ${pathname === '/' ? 'font-semibold text-primary' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/prompts" 
              className={`hover:text-primary ${pathname.startsWith('/prompts') ? 'font-semibold text-primary' : ''}`}
            >
              Prompts
            </Link>
            <Link 
              href="/youtube" 
              className={`hover:text-primary ${pathname.startsWith('/youtube') ? 'font-semibold text-primary' : ''}`}
            >
              YouTube
            </Link>
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="icon">
                <Link href="https://github.com/nkkko/neoartifex" target="_blank" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Link href="https://youtube.com/@neoartifex" target="_blank" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-2">
            <Link 
              href="/" 
              className={`block py-2 ${pathname === '/' ? 'font-semibold text-primary' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/prompts" 
              className={`block py-2 ${pathname.startsWith('/prompts') ? 'font-semibold text-primary' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Prompts
            </Link>
            <Link 
              href="/youtube" 
              className={`block py-2 ${pathname.startsWith('/youtube') ? 'font-semibold text-primary' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              YouTube
            </Link>
            <div className="flex space-x-2 py-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="https://github.com/nkkko/neoartifex" target="_blank" className="flex items-center">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="https://youtube.com/@neoartifex" target="_blank" className="flex items-center">
                  <Youtube className="h-4 w-4 mr-2" />
                  YouTube
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}