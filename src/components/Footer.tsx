import Link from 'next/link';
import { Github, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">NeoArtifex</h3>
            <p className="text-muted-foreground">
              Your personal library for crafting and organizing AI prompts.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/prompts" className="text-muted-foreground hover:text-primary transition-colors">
                  Prompts Library
                </Link>
              </li>
              <li>
                <Link href="https://github.com/nkkko/neoartifex" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                  GitHub Repository
                </Link>
              </li>
              <li>
                <Link href="https://youtube.com/@neoartifex" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                  YouTube Channel
                </Link>
              </li>
              <li>
                <Link href="https://github.com/nkkko/neoartifex/blob/main/CONTRIBUTING.md" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                  Contributing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="flex flex-col space-y-2">
              <Button asChild variant="ghost" className="justify-start w-fit h-auto p-0">
                <a href="mailto:hi@neoartifex.com" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 mr-2" />
                  hi@neoartifex.com
                </a>
              </Button>
              
              <Button asChild variant="ghost" className="justify-start w-fit h-auto p-0">
                <a href="https://youtube.com/@neoartifex" target="_blank" rel="noopener noreferrer" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                  <Youtube className="h-4 w-4 mr-2" />
                  YouTube
                </a>
              </Button>
              
              <Button asChild variant="ghost" className="justify-start w-fit h-auto p-0">
                <a href="https://github.com/nkkko" target="_blank" rel="noopener noreferrer" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p>© {currentYear} <a href="https://neoartifex.com" className="hover:text-primary transition-colors">NeoArtifex.com</a>. All rights reserved.</p>
            <div className="flex items-center">
              <span className="mr-2 text-sm">Theme:</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}