'use client';

import { useState, useEffect, useCallback } from 'react';
import { Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';

type FilterSettingsProps = {
  tags: string[];
  onFilterChange: (selectedTags: string[]) => void;
};

export function FilterSettings({
  tags,
  onFilterChange,
}: FilterSettingsProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Apply filter when selectedTags changes
  const applyFilter = useCallback(() => {
    onFilterChange(selectedTags);
  }, [selectedTags, onFilterChange]);

  // Only trigger filter when selectedTags changes
  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto flex gap-2">
          <Filter size={16} />
          Filter Prompts {selectedTags.length > 0 && <Badge variant="secondary" className="text-xs">{selectedTags.length}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Filter by Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Toggle
                  key={tag}
                  pressed={selectedTags.includes(tag)}
                  onPressedChange={() => handleTagToggle(tag)}
                  variant="outline"
                  size="sm"
                >
                  {tag}
                </Toggle>
              ))}
              {tags.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No tags available
                </div>
              )}
            </div>
          </div>
          {selectedTags.length > 0 && (
            <>
              <Separator />
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedTags([])}
                >
                  Clear All
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}