'use client';

import { useState, useEffect, useCallback } from 'react';
import { PromptCard } from '@/components/PromptCard';
import { PromptRow } from '@/components/PromptRow';
import { FilterSettings } from '@/components/FilterSettings';
import { DisplaySettings } from '@/components/DisplaySettings';
import { FavoriteSettings } from '@/components/FavoriteSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { Prompt } from '@/types';

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Partial<Prompt>[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Partial<Prompt>[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const response = await fetch('/api/prompts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch prompts');
        }
        
        const data = await response.json();
        setPrompts(data);
        setFilteredPrompts(data);
        
        const tags = new Set<string>();
        data.forEach((prompt: Partial<Prompt>) => {
          prompt.tags?.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));

        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('favoritedPrompts');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPrompts();

    // Listen for favorite updates from other components
    const handleFavoritesUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.favorites) {
        setFavorites(customEvent.detail.favorites);
      }
    };

    window.addEventListener('favorites-updated', handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdate);
    };
  }, []);

  // Use useCallback to memoize handlers
  const handleFilterChange = useCallback((selectedTags: string[]) => {
    if (selectedTags.length === 0) {
      setFilteredPrompts(prompts);
    } else {
      setFilteredPrompts(
        prompts.filter(prompt => 
          selectedTags.every(tag => prompt.tags?.includes(tag))
        )
      );
    }
  }, [prompts]);

  const handleSortChange = useCallback((option: string) => {
    setSortOption(option);
    setFilteredPrompts(prevPrompts => {
      const sortedPrompts = [...prevPrompts];
      
      switch (option) {
        case 'newest':
          sortedPrompts.sort((a, b) => {
            if (!a.created || !b.created) return 0;
            return new Date(b.created).getTime() - new Date(a.created).getTime();
          });
          break;
        case 'oldest':
          sortedPrompts.sort((a, b) => {
            if (!a.created || !b.created) return 0;
            return new Date(a.created).getTime() - new Date(b.created).getTime();
          });
          break;
        case 'a-z':
          sortedPrompts.sort((a, b) => 
            (a.title || '').localeCompare(b.title || '')
          );
          break;
        case 'z-a':
          sortedPrompts.sort((a, b) => 
            (b.title || '').localeCompare(a.title || '')
          );
          break;
        default:
          break;
      }
      
      return sortedPrompts;
    });
  }, []);
  
  const handleViewChange = useCallback((view: 'grid' | 'list') => {
    setViewMode(view);
  }, []);

  const handleFavoritesChange = useCallback((newFavorites: string[]) => {
    setFavorites(newFavorites);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">LLM Prompts Library</h1>
        <div className="flex flex-wrap gap-2 justify-end">
          <FilterSettings 
            tags={allTags} 
            onFilterChange={handleFilterChange} 
          />
          <FavoriteSettings 
            favorites={favorites}
            onFavoritesChange={handleFavoritesChange}
            allPrompts={prompts}
          />
          <DisplaySettings 
            view={viewMode}
            onViewChange={handleViewChange}
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
      
      {loading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[180px] w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 border rounded-md">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border-b">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : filteredPrompts.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground mt-8 border rounded-md">
          No prompts found. Add some markdown files to the /prompts directory to get started.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border rounded-md">
          {filteredPrompts.map((prompt) => (
            <PromptRow key={prompt.slug} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
}