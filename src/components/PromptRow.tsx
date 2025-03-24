import Link from 'next/link';
import { Prompt } from '@/types';
import { Badge } from '@/components/ui/badge';
import { StarButton } from '@/components/StarButton';
import { CopyPromptButton } from '@/components/CopyPromptButton';

type PromptRowProps = {
  prompt: Partial<Prompt>;
};

export function PromptRow({ prompt }: PromptRowProps) {
  return (
    <Link 
      href={`/prompts/${prompt.slug}`} 
      className="block hover:no-underline transition-colors hover:bg-accent/10"
    >
      <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 border-b">
        <div className="space-y-1 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium mr-2">{prompt.title}</h3>
            <div className="flex items-center gap-1">
              <CopyPromptButton slug={prompt.slug || ''} className="flex-shrink-0" />
              <StarButton slug={prompt.slug || ''} className="flex-shrink-0" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">{prompt.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {prompt.tags?.map((tag) => (
              <Badge variant="secondary" key={tag} className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        {prompt.version && prompt.version > 1 && (
          <div className="flex items-end justify-end">
            <Badge variant="outline" className="text-xs border-primary text-primary">
              v{prompt.version}
            </Badge>
          </div>
        )}
      </div>
    </Link>
  );
}