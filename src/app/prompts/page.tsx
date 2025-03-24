'use client';

import { useState, useEffect, useCallback } from 'react';
import { PromptCard } from '@/components/PromptCard';
import { PromptRow } from '@/components/PromptRow';
import { FilterSettings } from '@/components/FilterSettings';
import { DisplaySettings } from '@/components/DisplaySettings';
import { FavoriteSettings } from '@/components/FavoriteSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { Prompt } from '@/types';

// Helper function to sort prompts consistently
const sortPrompts = (
  prompts: Partial<Prompt>[], 
  sortOption: string, 
  favorites: string[],
  ratings: Record<string, { like: number; dislike: number; score: number }> = {}
): Partial<Prompt>[] => {
  const sortedPrompts = [...prompts];
  
  switch (sortOption) {
    case 'favorites':
      // Sort by favorite status
      sortedPrompts.sort((a, b) => {
        const aIsFavorited = favorites.includes(a.slug || '');
        const bIsFavorited = favorites.includes(b.slug || '');
        
        if (aIsFavorited === bIsFavorited) {
          // If both have same favorite status, sort by newest
          if (!a.created || !b.created) return 0;
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        }
        
        // Favorited items come first
        return aIsFavorited ? -1 : 1;
      });
      break;
    case 'likes':
      // Sort by like score (likes - dislikes)
      sortedPrompts.sort((a, b) => {
        const aScore = ratings[a.slug || '']?.score || 0;
        const bScore = ratings[b.slug || '']?.score || 0;
        
        if (bScore === aScore) {
          // If scores are equal, sort by total engagement (likes + dislikes)
          const aEngagement = (ratings[a.slug || '']?.like || 0) + (ratings[a.slug || '']?.dislike || 0);
          const bEngagement = (ratings[b.slug || '']?.like || 0) + (ratings[b.slug || '']?.dislike || 0);
          
          if (bEngagement === aEngagement) {
            // If engagement is also equal, sort by newest
            if (!a.created || !b.created) return 0;
            return new Date(b.created).getTime() - new Date(a.created).getTime();
          }
          
          return bEngagement - aEngagement;
        }
        
        return bScore - aScore; // Higher scores first
      });
      break;
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
};

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Partial<Prompt>[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Partial<Prompt>[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, { like: number; dislike: number; score: number }>>({});

  useEffect(() => {
    // Load display preferences from sessionStorage
    const loadDisplayPreferences = () => {
      try {
        const savedViewMode = sessionStorage.getItem('promptsViewMode');
        const savedSortOption = sessionStorage.getItem('promptsSortOption');
        
        if (savedViewMode === 'grid' || savedViewMode === 'list') {
          setViewMode(savedViewMode);
        }
        
        if (savedSortOption) {
          setSortOption(savedSortOption);
        }
      } catch (error) {
        console.error('Error loading display preferences:', error);
      }
    };

    async function fetchPrompts() {
      try {
        // Fetch prompts and ratings in parallel
        const [promptsResponse, ratingsResponse] = await Promise.all([
          fetch('/api/prompts'),
          fetch('/api/ratings')
        ]);
        
        if (!promptsResponse.ok) {
          throw new Error('Failed to fetch prompts');
        }
        
        const data = await promptsResponse.json();
        setPrompts(data);
        
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
        
        // Load ratings if available
        let ratingsData = {};
        if (ratingsResponse.ok) {
          const ratingsResult = await ratingsResponse.json();
          ratingsData = ratingsResult.ratings || {};
          setRatings(ratingsData);
        }
        
        // Initial prompt sorting will happen after the data is loaded 
        // and the saved sort option has been applied
        const currentSortOption = sessionStorage.getItem('promptsSortOption') || 'newest';
        const sortedData = sortPrompts(
          data, 
          currentSortOption, 
          savedFavorites ? JSON.parse(savedFavorites) : [],
          ratingsData
        );
        setFilteredPrompts(sortedData);
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    // Load preferences first, then fetch prompts
    loadDisplayPreferences();
    fetchPrompts();

    // Listen for favorite updates from other components
    const handleFavoritesUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.favorites) {
        setFavorites(customEvent.detail.favorites);
      }
    };

    // Create a custom event for rating updates
    const handleRatingsUpdate = () => {
      const fetchLatestRatings = async () => {
        try {
          const response = await fetch('/api/ratings');
          if (response.ok) {
            const data = await response.json();
            const ratingsData = data.ratings || {};
            setRatings(ratingsData);
            
            // Re-sort the prompts if the sort option is 'likes'
            if (sortOption === 'likes') {
              setFilteredPrompts(prevPrompts => 
                sortPrompts(prevPrompts, sortOption, favorites, ratingsData)
              );
            }
          }
        } catch (error) {
          console.error('Error fetching updated ratings:', error);
        }
      };
      
      fetchLatestRatings();
    };

    // Poll for rating updates every 30 seconds if sort option is 'likes'
    let ratingsPollInterval: NodeJS.Timeout | null = null;
    if (sortOption === 'likes') {
      ratingsPollInterval = setInterval(handleRatingsUpdate, 30000);
    }
    
    window.addEventListener('favorites-updated', handleFavoritesUpdate);
    
    // Custom event for when a new rating is submitted
    window.addEventListener('rating-submitted', handleRatingsUpdate);
    
    return () => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdate);
      window.removeEventListener('rating-submitted', handleRatingsUpdate);
      if (ratingsPollInterval) {
        clearInterval(ratingsPollInterval);
      }
    };
  }, [sortOption, favorites]);

  // Use useCallback to memoize handlers
  const handleFilterChange = useCallback((selectedTags: string[]) => {
    let filtered = prompts;
    
    if (selectedTags.length > 0) {
      filtered = prompts.filter(prompt => 
        selectedTags.every(tag => prompt.tags?.includes(tag))
      );
    }
    
    // Re-apply the current sort order to the filtered prompts
    const sorted = sortPrompts(filtered, sortOption, favorites, ratings);
    setFilteredPrompts(sorted);
  }, [prompts, sortOption, favorites, ratings]);

  const handleSortChange = useCallback((option: string) => {
    // Save sort option to sessionStorage
    try {
      sessionStorage.setItem('promptsSortOption', option);
    } catch (error) {
      console.error('Error saving sort option to sessionStorage:', error);
    }
    
    setSortOption(option);
    
    // Use the sortPrompts helper function for consistent sorting
    setFilteredPrompts(prevPrompts => sortPrompts(prevPrompts, option, favorites, ratings));
  }, [favorites, ratings]);
  
  const handleViewChange = useCallback((view: 'grid' | 'list') => {
    // Save view mode to sessionStorage
    try {
      sessionStorage.setItem('promptsViewMode', view);
    } catch (error) {
      console.error('Error saving view mode to sessionStorage:', error);
    }
    
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