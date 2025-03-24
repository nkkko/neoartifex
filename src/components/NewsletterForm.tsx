'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage({
        text: 'Please enter a valid email address',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setEmail('');
        setMessage({
          text: 'Thank you for subscribing to the Artificer\'s Guild!',
          type: 'success'
        });
      } else {
        setMessage({
          text: data.message || 'Failed to subscribe. Please try again later.',
          type: 'error'
        });
      }
    } catch (error) {
      setMessage({
        text: 'An unexpected error occurred. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="flex-grow"
            required
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="sm:flex-shrink-0"
          >
            {isSubmitting ? 'Joining...' : 'JOIN THE GUILD'}
          </Button>
        </div>
        
        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}