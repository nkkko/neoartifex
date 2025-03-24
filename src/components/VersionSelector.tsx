import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type VersionSelectorProps = {
  slug: string;
  versions: number[];
  currentVersion: number;
};

export default function VersionSelector({ 
  slug, 
  versions, 
  currentVersion 
}: VersionSelectorProps) {
  const router = useRouter();

  const handleVersionChange = (value: string) => {
    const version = parseInt(value, 10);
    if (version === 1) {
      router.push(`/prompts/${slug}`);
    } else {
      router.push(`/prompts/${slug}?version=${version}`);
    }
  };

  if (versions.length <= 1) {
    return null;
  }

  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-1">
        Version:
      </p>
      <Select value={currentVersion.toString()} onValueChange={handleVersionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select version" />
        </SelectTrigger>
        <SelectContent>
          {versions.map((version) => (
            <SelectItem key={version} value={version.toString()}>
              Version {version}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}