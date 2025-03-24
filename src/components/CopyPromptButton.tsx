'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyPromptButtonProps {
  slug: string;
  className?: string;
}

export function CopyPromptButton({ slug, className }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async (e: React.MouseEvent) => {
    // Prevent the link navigation when clicking the copy button
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Fetch the prompt content
      const response = await fetch(`/api/prompts/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prompt');
      }
      
      const data = await response.json();
      
      // Copy the content to clipboard
      await navigator.clipboard.writeText(data.content);
      
      // Show success state briefly
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying prompt:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={handleCopy}
      title="Copy prompt"
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}