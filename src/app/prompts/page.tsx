'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PromptCard } from '@/components/PromptCard';
import { PromptRow } from '@/components/PromptRow';
import { FilterSettings } from '@/components/FilterSettings';
import { DisplaySettings } from '@/components/DisplaySettings';
import { FavoriteSettings } from '@/components/FavoriteSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { Prompt } from '@/types';

// Cache ratings in localStorage
const RATINGS_CACHE_KEY = 'cachedServerRatings';
const RATINGS_CACHE_EXPIRY = 1000 * 60 * 5; // 5 minutes

// Helper to get cached server ratings
const getCachedRatings = (): { ratings: Record<string, { like: number; dislike: number; score: number }>, timestamp: number } | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cache = localStorage.getItem(RATINGS_CACHE_KEY);
    if (!cache) return null;
    
    const parsed = JSON.parse(cache);
    // Check if cache is still valid
    if (Date.now() - parsed.timestamp > RATINGS_CACHE_EXPIRY) {
      return null; // Cache expired
    }
    
    return parsed;
  } catch (error) {
    console.error('Error parsing cached ratings:', error);
    return null;
  }
};

// Helper to set cached server ratings
const setCachedRatings = (ratings: Record<string, { like: number; dislike: number; score: number }>) => {
  if (typeof window === 'undefined') return;
  
  try {
    const cache = {
      ratings,
      timestamp: Date.now()
    };
    localStorage.setItem(RATINGS_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error caching server ratings:', error);
  }
};

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
  
  // Use refs to avoid infinite loops in useEffect
  const sortOptionRef = useRef(sortOption);
  const favoritesRef = useRef(favorites);
  const ratingsRef = useRef(ratings);
  const promptsRef = useRef(prompts);

  // Update refs when state changes
  useEffect(() => {
    sortOptionRef.current = sortOption;
  }, [sortOption]);
  
  useEffect(() => {
    favoritesRef.current = favorites;
  }, [favorites]);
  
  useEffect(() => {
    ratingsRef.current = ratings;
  }, [ratings]);
  
  useEffect(() => {
    promptsRef.current = prompts;
  }, [prompts]);

  // Batch fetch ratings for all prompts
  const fetchAllRatings = useCallback(async (promptSlugs: string[]) => {
    try {
      // Check cache first
      const cachedData = getCachedRatings();
      if (cachedData) {
        setRatings(cachedData.ratings);
        return cachedData.ratings;
      }
      
      // Fetch from API if not cached
      const response = await fetch('/api/ratings');
      if (response.ok) {
        const data = await response.json();
        const ratingsData = data.ratings || {};
        
        // Cache the ratings
        setCachedRatings(ratingsData);
        
        // Update state
        setRatings(ratingsData);
        return ratingsData;
      }
      return {};
    } catch (error) {
      console.error('Error fetching ratings:', error);
      return {};
    }
  }, []);

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
          sortOptionRef.current = savedSortOption;
        }
      } catch (error) {
        console.error('Error loading display preferences:', error);
      }
    };

    async function fetchPrompts() {
      try {
        // Fetch prompts
        const promptsResponse = await fetch('/api/prompts');
        
        if (!promptsResponse.ok) {
          throw new Error('Failed to fetch prompts');
        }
        
        const data = await promptsResponse.json();
        setPrompts(data);
        promptsRef.current = data;
        
        // Extract prompt slugs for batch rating fetch
        const slugs = data.map((prompt: Partial<Prompt>) => prompt.slug || '').filter(Boolean);
        
        // Extract all tags for filtering
        const tags = new Set<string>();
        data.forEach((prompt: Partial<Prompt>) => {
          prompt.tags?.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags));

        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('favoritedPrompts');
        const currentFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
        setFavorites(currentFavorites);
        favoritesRef.current = currentFavorites;
        
        // Fetch all ratings in one batch request
        const ratingsData = await fetchAllRatings(slugs);
        
        // Set initial sorting with all data
        const currentSortOption = sessionStorage.getItem('promptsSortOption') || 'newest';
        sortOptionRef.current = currentSortOption;
        
        const sortedData = sortPrompts(
          data, 
          currentSortOption, 
          currentFavorites,
          ratingsData
        );
        
        setFilteredPrompts(sortedData);
        setLoading(false);
        
        // Prefetch individual ratings for each prompt to ensure they're cached
        // This runs after the initial render to improve perceived performance
        setTimeout(() => {
          prefetchIndividualRatings(slugs, ratingsData);
        }, 1000);
      } catch (error) {
        console.error('Error fetching prompts:', error);
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
          // Get all prompt slugs
          const slugs = promptsRef.current.map(p => p.slug || '').filter(Boolean);
          
          // Re-fetch all ratings
          const updatedRatings = await fetchAllRatings(slugs);
          
          // Re-sort the prompts if the sort option is 'likes'
          if (sortOptionRef.current === 'likes') {
            setFilteredPrompts(prevPrompts => 
              sortPrompts(prevPrompts, sortOptionRef.current, favoritesRef.current, updatedRatings)
            );
          }
        } catch (error) {
          console.error('Error fetching updated ratings:', error);
        }
      };
      
      fetchLatestRatings();
    };

    // Poll for rating updates every 30 seconds if sort option is 'likes'
    let ratingsPollInterval: NodeJS.Timeout | null = null;
    if (sortOptionRef.current === 'likes') {
      ratingsPollInterval = setInterval(handleRatingsUpdate, 30000);
    }
    
    window.addEventListener('favorites-updated', handleFavoritesUpdate);
    window.addEventListener('rating-submitted', handleRatingsUpdate);
    
    return () => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdate);
      window.removeEventListener('rating-submitted', handleRatingsUpdate);
      if (ratingsPollInterval) {
        clearInterval(ratingsPollInterval);
      }
    };
  }, [fetchAllRatings]);

  // Prefetch individual ratings to ensure they're in the cache
  const prefetchIndividualRatings = async (slugs: string[], existingRatings: Record<string, any>) => {
    // Only prefetch what we don't already have in the cache
    const cached = getCachedRatings();
    if (cached) {
      // For better performance, split into chunks of 10 prefetches at a time
      const chunkSize = 10;
      for (let i = 0; i < slugs.length; i += chunkSize) {
        const chunk = slugs.slice(i, i + chunkSize);
        
        // Process each chunk in parallel
        await Promise.all(chunk.map(async (slug) => {
          try {
            // Skip if already in cache
            if (cached.ratings[slug]) return;
            
            // Prefetch in background
            fetch(`/api/ratings?slugs=${slug}`).catch(() => {});
          } catch (error) {
            // Ignore errors during prefetching
          }
        }));
        
        // Small delay between chunks to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  };

  // Use useCallback to memoize handlers
  const handleFilterChange = useCallback((selectedTags: string[]) => {
    let filtered = promptsRef.current;
    
    if (selectedTags.length > 0) {
      filtered = promptsRef.current.filter(prompt => 
        selectedTags.every(tag => prompt.tags?.includes(tag))
      );
    }
    
    // Re-apply the current sort order to the filtered prompts
    const sorted = sortPrompts(
      filtered, 
      sortOptionRef.current, 
      favoritesRef.current, 
      ratingsRef.current
    );
    setFilteredPrompts(sorted);
  }, []);

  const handleSortChange = useCallback((option: string) => {
    // Save sort option to sessionStorage
    try {
      sessionStorage.setItem('promptsSortOption', option);
    } catch (error) {
      console.error('Error saving sort option to sessionStorage:', error);
    }
    
    setSortOption(option);
    sortOptionRef.current = option;
    
    // Use the sortPrompts helper function for consistent sorting
    setFilteredPrompts(prevPrompts => 
      sortPrompts(prevPrompts, option, favoritesRef.current, ratingsRef.current)
    );
  }, []);
  
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