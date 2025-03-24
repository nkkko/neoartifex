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
import { CopyPromptButton } from '@/components/CopyPromptButton';

type PromptCardProps = {
  prompt: Partial<Prompt>;
};

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link href={`/prompts/${prompt.slug}`} className="block hover:no-underline transition-transform hover:scale-[1.02]">
      <Card className="h-full hover:border-primary/50">
        <CardHeader className="relative pb-2">
          <div className="absolute top-4 right-4 flex items-center space-x-1">
            <CopyPromptButton slug={prompt.slug || ''} />
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
        {prompt.version && prompt.version > 1 && (
          <CardFooter className="flex justify-end">
            <Badge variant="outline" className="border-primary text-primary">
              v{prompt.version}
            </Badge>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}