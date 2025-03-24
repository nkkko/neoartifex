'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

type FavoriteSettingsProps = {
  onFavoritesChange: (favorites: string[]) => void;
  favorites: string[];
  allPrompts: Array<{ slug: string; title: string }>;
};

export function FavoriteSettings({
  favorites,
  onFavoritesChange,
  allPrompts
}: FavoriteSettingsProps) {
  const favoritedPrompts = allPrompts.filter(prompt => favorites.includes(prompt.slug));
  
  const clearFavorites = () => {
    localStorage.setItem('favoritedPrompts', JSON.stringify([]));
    onFavoritesChange([]);
  };

  const removeFavorite = (slug: string) => {
    const newFavorites = favorites.filter(item => item !== slug);
    localStorage.setItem('favoritedPrompts', JSON.stringify(newFavorites));
    onFavoritesChange(newFavorites);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto flex gap-2">
          <Star size={16} className={favorites.length > 0 ? "fill-yellow-400 text-yellow-400" : ""} />
          Favorites {favorites.length > 0 && 
            <Badge variant="secondary" className="text-xs">{favorites.length}</Badge>
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Starred Prompts</h4>
            {favoritedPrompts.length === 0 ? (
              <div className="text-sm text-muted-foreground py-2">
                No favorites yet. Star some prompts!
              </div>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {favoritedPrompts.map((prompt) => (
                    <div key={prompt.slug} className="flex items-center justify-between group">
                      <Link 
                        href={`/prompts/${prompt.slug}`} 
                        className="text-sm hover:underline flex-1 truncate"
                      >
                        {prompt.title}
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFavorite(prompt.slug);
                        }}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
          {favorites.length > 0 && (
            <>
              <Separator />
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFavorites}
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