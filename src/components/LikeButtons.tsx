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
      });
    } catch (error) {
      console.error('Error sending rating to server:', error);
    }
  } catch (error) {
    console.error('Error saving rating:', error);
  }
};

export function LikeButtons({ slug, className }: LikeButtonsProps) {
  const [rating, setRating] = useState<PromptRating>({ liked: null, count: 0 });
  
  // Load initial state from localStorage
  useEffect(() => {
    setRating(getRating(slug));
  }, [slug]);
  
  const handleRate = (liked: boolean, e: React.MouseEvent) => {
    // Prevent parent link navigation
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle if already selected
    const newValue = rating.liked === liked ? null : liked;
    setRating(prev => ({ ...prev, liked: newValue, count: prev.count + 1 }));
    saveRating(slug, newValue);
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
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