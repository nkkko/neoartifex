'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import VersionSelector from '@/components/VersionSelector';
import { CodeBlock } from '@/components/ui/code-block';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Prompt } from '@/types';

export default function PromptPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const versionParam = searchParams.get('version');
  
  const [prompt, setPrompt] = useState<Partial<Prompt> | null>(null);
  const [versions, setVersions] = useState<number[]>([1]);
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!slug) return;
    
    const requestedVersion = versionParam ? parseInt(versionParam, 10) : undefined;
    if (requestedVersion) {
      setCurrentVersion(requestedVersion);
    }

    async function fetchPrompt() {
      try {
        const url = `/api/prompts/${slug}${requestedVersion ? `?version=${requestedVersion}` : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch prompt');
        }
        
        const data = await response.json();
        setPrompt(data.prompt);
        setVersions(data.versions);
      } catch (error) {
        console.error('Error fetching prompt:', error);
        setPrompt(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPrompt();
  }, [slug, versionParam]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/prompts" className="gap-1">
              &larr; Back to all prompts
            </Link>
          </Button>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/prompts" className="gap-1">
              &larr; Back to all prompts
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-40">
            <p className="text-destructive">Prompt not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract just the prompt content without frontmatter
  const promptContent = prompt.content || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/prompts" className="gap-1">
            &larr; Back to all prompts
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{prompt.title}</h1>
          <p className="text-muted-foreground mb-4">{prompt.description}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
          <VersionSelector 
            slug={prompt.slug || ''} 
            versions={versions} 
            currentVersion={currentVersion} 
          />
          
          <div className="flex flex-wrap gap-2 mb-2">
            {prompt.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-4 flex flex-wrap gap-4">
          <span>Created: {new Date(prompt.created || '').toLocaleDateString()}</span>
          {prompt.author && (
            <span>Author: {prompt.author}</span>
          )}
          <span>Version: {prompt.version}</span>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <CodeBlock
              showCopyButton={true}
              className="mt-0"
            >
              {promptContent}
            </CodeBlock>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

