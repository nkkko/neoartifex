import Link from 'next/link';
import { Prompt } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Tag } from 'lucide-react';

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
          <h3 className="text-lg font-medium">{prompt.title}</h3>
          <p className="text-muted-foreground text-sm">{prompt.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {prompt.tags?.map((tag) => (
              <Badge variant="secondary" key={tag} className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-row sm:flex-col gap-3 items-end justify-end text-xs text-muted-foreground sm:min-w-[120px]">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(prompt.created || '').toLocaleDateString()}
          </div>
          {prompt.author && (
            <div className="flex items-center gap-1">
              <User size={14} />
              {prompt.author}
            </div>
          )}
          {prompt.version && prompt.version > 1 && (
            <Badge variant="outline" className="text-xs border-primary text-primary">
              v{prompt.version}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}