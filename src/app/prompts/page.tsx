'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PromptCard } from '@/components/PromptCard';
import { PromptRow } from '@/components/PromptRow';
import { FilterSettings } from '@/components/FilterSettings';
import { DisplaySettings } from '@/components/DisplaySettings';
import { FavoriteSettings } from '@/components/FavoriteSettings';
import { NewsletterForm } from '@/components/NewsletterForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Prompt } from '@/types';
import { Github, ChevronLeft, ChevronRight } from 'lucide-react';

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);
  
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

  // Simplified - ratings are now fetched together with prompts
  const fetchAllRatings = useCallback(async () => {
    try {
      // Ratings are now fetched with prompts
      // This is just a fallback for direct rating updates
      const response = await fetch('/api/ratings');
      if (response.ok) {
        const data = await response.json();
        const ratingsData = data.ratings || {};
        
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

    async function fetchPromptsAndRatings() {
      try {
        // Check cache first
        const cacheKey = 'promptsAndRatingsCache';
        const cacheExpiryTime = 1000 * 60 * 5; // 5 minutes
        let shouldFetchFromAPI = true;
        
        if (typeof window !== 'undefined') {
          try {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
              const { data, timestamp } = JSON.parse(cachedData);
              // Use cache if it's less than 5 minutes old
              if (Date.now() - timestamp < cacheExpiryTime) {
                setPrompts(data.prompts);
                promptsRef.current = data.prompts;
                setRatings(data.ratings);
                ratingsRef.current = data.ratings;
                shouldFetchFromAPI = false;
                
                // Extract all tags for filtering
                const tags = new Set<string>();
                data.prompts.forEach((prompt: Partial<Prompt>) => {
                  prompt.tags?.forEach(tag => tags.add(tag));
                });
                setAllTags(Array.from(tags));

                // Load favorites from localStorage
                const savedFavorites = localStorage.getItem('favoritedPrompts');
                const currentFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
                setFavorites(currentFavorites);
                favoritesRef.current = currentFavorites;
                
                // Set initial sorting with all data
                const currentSortOption = sessionStorage.getItem('promptsSortOption') || 'newest';
                sortOptionRef.current = currentSortOption;
                
                const sortedData = sortPrompts(
                  data.prompts, 
                  currentSortOption, 
                  currentFavorites,
                  data.ratings
                );
                
                setFilteredPrompts(sortedData);
                setLoading(false);
              }
            }
          } catch (e) {
            console.error('Error reading from cache:', e);
          }
        }
        
        if (shouldFetchFromAPI) {
          // Fetch prompts and ratings in a single request
          const response = await fetch('/api/prompts', {
            headers: {
              'Cache-Control': 'no-cache'
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch prompts and ratings');
          }
          
          const { prompts: promptsData, ratings: ratingsData } = await response.json();
          
          // Update state
          setPrompts(promptsData);
          promptsRef.current = promptsData;
          setRatings(ratingsData);
          ratingsRef.current = ratingsData;
          
          // Extract all tags for filtering
          const tags = new Set<string>();
          promptsData.forEach((prompt: Partial<Prompt>) => {
            prompt.tags?.forEach(tag => tags.add(tag));
          });
          setAllTags(Array.from(tags));

          // Load favorites from localStorage
          const savedFavorites = localStorage.getItem('favoritedPrompts');
          const currentFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
          setFavorites(currentFavorites);
          favoritesRef.current = currentFavorites;
          
          // Set initial sorting with all data
          const currentSortOption = sessionStorage.getItem('promptsSortOption') || 'newest';
          sortOptionRef.current = currentSortOption;
          
          const sortedData = sortPrompts(
            promptsData, 
            currentSortOption, 
            currentFavorites,
            ratingsData
          );
          
          setFilteredPrompts(sortedData);
          setLoading(false);
          
          // Cache the response
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(cacheKey, JSON.stringify({
                data: { prompts: promptsData, ratings: ratingsData },
                timestamp: Date.now()
              }));
            } catch (e) {
              console.error('Error storing in cache:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching prompts and ratings:', error);
        setLoading(false);
      }
    }
    
    // Load preferences first, then fetch prompts and ratings
    loadDisplayPreferences();
    fetchPromptsAndRatings();

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
          // Re-fetch all ratings
          const updatedRatings = await fetchAllRatings();
          
          // Re-sort the prompts if the sort option is 'likes'
          if (sortOptionRef.current === 'likes') {
            setFilteredPrompts(prevPrompts => 
              sortPrompts(prevPrompts, sortOptionRef.current, favoritesRef.current, updatedRatings)
            );
            // Reset to first page when ratings change affects sorting
            setCurrentPage(1);
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
    // Reset to first page when filters change
    setCurrentPage(1);
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
    
    // Reset to first page when sort changes
    setCurrentPage(1);
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
    
    // If sorting by favorites, reset to first page
    if (sortOptionRef.current === 'favorites') {
      setCurrentPage(1);
    }
  }, []);
  
  // Get current prompts for pagination
  const getCurrentPagePrompts = useCallback(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredPrompts.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, filteredPrompts, itemsPerPage]);
  
  // Change page handler
  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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
          {getCurrentPagePrompts().map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border rounded-md">
          {getCurrentPagePrompts().map((prompt) => (
            <PromptRow key={prompt.slug} prompt={prompt} />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {filteredPrompts.length > 0 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: Math.ceil(filteredPrompts.length / itemsPerPage) }).map((_, index) => {
              const pageNumber = index + 1;
              // Show only current page, first, last, and adjacent pages
              if (
                pageNumber === 1 ||
                pageNumber === Math.ceil(filteredPrompts.length / itemsPerPage) ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    aria-label={`Page ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? "page" : undefined}
                  >
                    {pageNumber}
                  </Button>
                );
              } else if (
                (pageNumber === currentPage - 2 && currentPage > 3) || 
                (pageNumber === currentPage + 2 && currentPage < Math.ceil(filteredPrompts.length / itemsPerPage) - 2)
              ) {
                // Show ellipsis for gaps
                return <span key={pageNumber} className="px-2">...</span>;
              }
              return null;
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredPrompts.length / itemsPerPage)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* CTAs: Newsletter and Contribute */}
      <div className="mt-20 mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Newsletter Signup */}
        <div className="bg-muted/50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Join the Artificer&apos;s Guild</h2>
          <p className="text-muted-foreground mb-6">Subscribe to receive updates about new prompts, AI techniques, and insights.</p>
          <div className="max-w-md">
            <NewsletterForm />
          </div>
        </div>
        
        {/* Contribute CTA */}
        <div className="bg-muted/50 rounded-lg p-6 border">
          <h2 className="text-xl font-semibold mb-4">Contribute Your Prompt</h2>
          <p className="text-muted-foreground mb-6">Have a great prompt that others would find useful? Share your knowledge with the community!</p>
          <a 
            href="https://github.com/nkkko/neoartifex/blob/main/CONTRIBUTING.md" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Github className="h-4 w-4 mr-2" />
            Learn how to contribute
          </a>
        </div>
      </div>
    </div>
  );
}