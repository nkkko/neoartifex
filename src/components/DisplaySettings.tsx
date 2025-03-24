'use client';

import { Settings, LayoutGrid, List } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type DisplaySettingsProps = {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  sortOption: string;
  onSortChange: (sortOption: string) => void;
};

export function DisplaySettings({
  view,
  onViewChange,
  sortOption,
  onSortChange,
}: DisplaySettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto flex gap-2">
          <Settings size={16} />
          Display Options
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">View</h4>
            <div className="flex gap-2">
              <Toggle 
                variant="outline" 
                aria-label="Toggle grid view"
                pressed={view === 'grid'}
                onPressedChange={() => onViewChange('grid')}
              >
                <LayoutGrid size={16} className="mr-1" />
                Cards
              </Toggle>
              <Toggle 
                variant="outline" 
                aria-label="Toggle list view"
                pressed={view === 'list'}
                onPressedChange={() => onViewChange('list')}
              >
                <List size={16} className="mr-1" />
                List
              </Toggle>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Sort By</h4>
            <Select value={sortOption} onValueChange={onSortChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="favorites">Favorites First</SelectItem>
                <SelectItem value="likes">Most Liked</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}