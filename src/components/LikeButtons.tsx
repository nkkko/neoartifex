'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeButtonsProps {
  slug: string;
  className?: string;
}

// Type for storing like/dislike status
type PromptRating = {
  liked: boolean | null; // true for like, false for dislike, null for no rating
  count: number; // A counter for analytics (how many times the user changed their rating)
};

// Helper functions for localStorage
const getRating = (slug: string): PromptRating => {
  if (typeof window === 'undefined') {
    return { liked: null, count: 0 };
  }
  
  const ratings = localStorage.getItem('promptRatings');
  if (!ratings) return { liked: null, count: 0 };
  
  try {
    const parsed = JSON.parse(ratings) as Record<string, PromptRating>;
    return parsed[slug] || { liked: null, count: 0 };
  } catch (error) {
    console.error('Error parsing ratings:', error);
    return { liked: null, count: 0 };
  }
};

const saveRating = (slug: string, liked: boolean | null) => {
  if (typeof window === 'undefined') return;
  
  try {
    const ratings = localStorage.getItem('promptRatings');
    const parsed = ratings ? JSON.parse(ratings) as Record<string, PromptRating> : {};
    
    const currentRating = parsed[slug] || { liked: null, count: 0 };
    parsed[slug] = {
      liked,
      count: currentRating.count + 1,
    };
    
    localStorage.setItem('promptRatings', JSON.stringify(parsed));
    
    // Send the rating to the server
    try {
      fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slug, liked })
      }).then(response => {
        if (response.ok) {
          // Dispatch a custom event that the page can listen for
          window.dispatchEvent(new CustomEvent('rating-submitted'));
        }
      });
    } catch (error) {
      console.error('Error sending rating to server:', error);
    }
  } catch (error) {
    console.error('Error saving rating:', error);
  }
};

interface ServerRating {
  like: number;
  dislike: number;
  score: number;
}

export function LikeButtons({ slug, className }: LikeButtonsProps) {
  const [rating, setRating] = useState<PromptRating>({ liked: null, count: 0 });
  const [serverRating, setServerRating] = useState<ServerRating | null>(null);
  
  // Load initial state from localStorage and fetch server ratings
  useEffect(() => {
    setRating(getRating(slug));
    
    // Fetch current ratings from server
    const fetchRatings = async () => {
      try {
        const response = await fetch('/api/ratings');
        if (response.ok) {
          const data = await response.json();
          if (data.ratings && data.ratings[slug]) {
            setServerRating(data.ratings[slug]);
          }
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };
    
    fetchRatings();
  }, [slug]);
  
  const handleRate = (liked: boolean, e: React.MouseEvent) => {
    // Prevent parent link navigation
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle if already selected
    const newValue = rating.liked === liked ? null : liked;
    setRating(prev => ({ ...prev, liked: newValue, count: prev.count + 1 }));
    saveRating(slug, newValue);
    
    // Update local score preview (optimistic UI update)
    if (serverRating) {
      const updatedRating = { ...serverRating };
      
      // If we're changing from like to dislike or vice versa, adjust both counters
      if (rating.liked === true && newValue === false) {
        // Changing from like to dislike
        updatedRating.like = Math.max(0, updatedRating.like - 1);
        updatedRating.dislike += 1;
      } else if (rating.liked === false && newValue === true) {
        // Changing from dislike to like
        updatedRating.dislike = Math.max(0, updatedRating.dislike - 1);
        updatedRating.like += 1;
      } else if (rating.liked === null && newValue === true) {
        // New like
        updatedRating.like += 1;
      } else if (rating.liked === null && newValue === false) {
        // New dislike
        updatedRating.dislike += 1;
      } else if (rating.liked === true && newValue === null) {
        // Removing like
        updatedRating.like = Math.max(0, updatedRating.like - 1);
      } else if (rating.liked === false && newValue === null) {
        // Removing dislike
        updatedRating.dislike = Math.max(0, updatedRating.dislike - 1);
      }
      
      // Update score
      updatedRating.score = updatedRating.like - updatedRating.dislike;
      setServerRating(updatedRating);
    }
  };

  // Calculate the score to display
  const score = serverRating?.score || 0;
  const scoreColor = score > 0 ? "text-green-500" : score < 0 ? "text-red-500" : "text-gray-500";

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        title="Like"
        onClick={(e) => handleRate(true, e)}
      >
        <ThumbsUp 
          className={cn(
            "h-4 w-4", 
            rating.liked === true ? "fill-green-500 text-green-500" : ""
          )} 
        />
      </Button>
      
      {/* Score display */}
      <span className={cn("text-sm font-medium", scoreColor)}>
        {score}
      </span>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        title="Dislike"
        onClick={(e) => handleRate(false, e)}
      >
        <ThumbsDown 
          className={cn(
            "h-4 w-4", 
            rating.liked === false ? "fill-red-500 text-red-500" : ""
          )} 
        />
      </Button>
    </div>
  );
}