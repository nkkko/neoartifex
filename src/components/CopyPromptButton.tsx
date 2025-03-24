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
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  
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
      
      if (!data.prompt || !data.prompt.content) {
        console.error('Invalid prompt data:', data);
        throw new Error('Prompt content not found');
      }
      
      // Copy the content to clipboard
      await navigator.clipboard.writeText(data.prompt.content);
      
      // Show success state briefly
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error('Error copying prompt:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={handleCopy}
      title={status === 'error' ? 'Failed to copy' : 'Copy prompt'}
    >
      {status === 'copied' && <Check className="h-4 w-4 text-green-500" />}
      {status === 'error' && <Copy className="h-4 w-4 text-red-500" />}
      {status === 'idle' && <Copy className="h-4 w-4" />}
    </Button>
  );
}