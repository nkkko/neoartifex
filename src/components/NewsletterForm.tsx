'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export function NewsletterForm() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [showNameFields, setShowNameFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.email.includes('@')) {
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setFormData({ email: '', firstName: '', lastName: '' });
        setShowNameFields(false);
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
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          {/* Email and Submit Button Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <motion.div 
              className="flex-grow"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full"
                required
              />
            </motion.div>
            
            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="sm:flex-shrink-0"
            >
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Joining...' : 'JOIN THE GUILD'}
              </Button>
            </motion.div>
          </div>
          
          {/* Name Fields (conditionally displayed) */}
          {showNameFields && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <Input
                type="text"
                name="firstName"
                placeholder="First name (optional)"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last name (optional)"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </motion.div>
          )}
          
          {/* Toggle for name fields */}
          <div className="flex justify-start items-center">
            {!showNameFields && !isSubmitting && !message?.type === 'success' && (
              <motion.button
                type="button"
                onClick={() => setShowNameFields(true)}
                className="text-xs text-primary/70 hover:text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                + Add your name (optional)
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Success/Error Message */}
        {message && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm ${message.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          >
            {message.text}
          </motion.p>
        )}
      </form>
    </div>
  );
}