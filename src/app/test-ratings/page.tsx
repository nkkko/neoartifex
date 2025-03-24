'use client';

import { useState, useEffect } from 'react';

type Rating = {
  like: number;
  dislike: number;
  score: number;
};

export default function TestRatingsPage() {
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [newRatingSlug, setNewRatingSlug] = useState('');

  // Load ratings
  const loadRatings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/ratings');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setRatings(data.ratings || {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading ratings');
    } finally {
      setIsLoading(false);
    }
  };

  // Run migration
  const runMigration = async () => {
    try {
      setIsMigrating(true);
      setError(null);
      const response = await fetch('/api/migrate-ratings');
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setMigrationResult(result);
      await loadRatings(); // Reload ratings after migration
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error migrating ratings');
    } finally {
      setIsMigrating(false);
    }
  };

  // Like a prompt
  const likePrompt = async (slug: string, isLike: boolean) => {
    try {
      setError(null);
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, liked: isLike }),
      });
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      await loadRatings(); // Reload ratings
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating rating');
    }
  };

  // Load ratings on mount
  useEffect(() => {
    loadRatings();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Ratings Implementation</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Actions</h2>
        
        <div className="flex gap-4 mb-4">
          <button 
            onClick={loadRatings}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Refresh Ratings'}
          </button>
          
          <button 
            onClick={runMigration}
            disabled={isMigrating}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isMigrating ? 'Migrating...' : 'Migrate Ratings'}
          </button>
        </div>
        
        {migrationResult && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Migration Result:</p>
            <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-auto">
              {JSON.stringify(migrationResult, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-4">
          <h3 className="font-bold">Test New Rating</h3>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newRatingSlug}
              onChange={(e) => setNewRatingSlug(e.target.value)}
              placeholder="Enter prompt slug"
              className="px-4 py-2 border rounded"
            />
            <button
              onClick={() => newRatingSlug && likePrompt(newRatingSlug, true)}
              className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded"
              disabled={!newRatingSlug}
            >
              👍 Like
            </button>
            <button
              onClick={() => newRatingSlug && likePrompt(newRatingSlug, false)}
              className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
              disabled={!newRatingSlug}
            >
              👎 Dislike
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-2">Current Ratings</h2>
        
        {isLoading ? (
          <p>Loading ratings...</p>
        ) : Object.keys(ratings).length === 0 ? (
          <p>No ratings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Prompt Slug</th>
                  <th className="py-2 px-4 border-b">Likes</th>
                  <th className="py-2 px-4 border-b">Dislikes</th>
                  <th className="py-2 px-4 border-b">Score</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(ratings).map(([slug, rating]) => (
                  <tr key={slug}>
                    <td className="py-2 px-4 border-b">{slug}</td>
                    <td className="py-2 px-4 border-b">{rating.like}</td>
                    <td className="py-2 px-4 border-b">{rating.dislike}</td>
                    <td className="py-2 px-4 border-b">{rating.score}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex gap-2">
                        <button
                          onClick={() => likePrompt(slug, true)}
                          className="bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => likePrompt(slug, false)}
                          className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                        >
                          👎
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}