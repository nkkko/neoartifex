'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

type StarButtonProps = {
  slug: string;
  className?: string;
};

export function StarButton({ slug, className = '' }: StarButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoritedPrompts');
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    setIsFavorited(favorites.includes(slug));
  }, [slug]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get current favorites from localStorage
    const savedFavorites = localStorage.getItem('favoritedPrompts');
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    // Toggle favorite status
    let newFavorites;
    if (isFavorited) {
      newFavorites = favorites.filter((item: string) => item !== slug);
    } else {
      newFavorites = [...favorites, slug];
    }
    
    // Save updated favorites to localStorage
    localStorage.setItem('favoritedPrompts', JSON.stringify(newFavorites));
    
    // Update state
    setIsFavorited(!isFavorited);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('favorites-updated', {
      detail: { favorites: newFavorites }
    }));
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        variant="ghost"
        size="sm"
        className={`h-8 w-8 p-0 ${className}`}
        onClick={toggleFavorite}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Star 
          className={`h-5 w-5 transition-all ${isFavorited ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
        />
      </Button>
    </motion.div>
  );
}