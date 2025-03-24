import Link from 'next/link';
import { Prompt } from '@/types';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarButton } from '@/components/StarButton';

type PromptCardProps = {
  prompt: Partial<Prompt>;
};

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link href={`/prompts/${prompt.slug}`} className="block hover:no-underline transition-transform hover:scale-[1.02]">
      <Card className="h-full hover:border-primary/50">
        <CardHeader className="relative pb-2">
          <div className="absolute top-4 right-4">
            <StarButton slug={prompt.slug || ''} />
          </div>
          <CardTitle>{prompt.title}</CardTitle>
          <CardDescription>{prompt.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-3">
            {prompt.tags?.map((tag) => (
              <Badge variant="secondary" key={tag}>
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between items-center">
          {prompt.author && (
            <span className="mr-auto text-sm text-muted-foreground">By: {prompt.author}</span>
          )}
          {prompt.version && prompt.version > 1 && (
            <Badge variant="outline" className="border-primary text-primary">
              v{prompt.version}
            </Badge>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {new Date(prompt.created || '').toLocaleDateString()}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}