'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus('error');
      setMessage('Email address is required to unsubscribe');
      return;
    }
    
    setStatus('loading');
    
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'You have been successfully unsubscribed');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to unsubscribe. Please try again later.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again later.');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Unsubscribe from the Artificer's Guild</CardTitle>
          <CardDescription>
            We're sorry to see you go
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!email ? (
            <p className="text-destructive">
              No email address was provided. Please click the unsubscribe link from your email again or contact us for support.
            </p>
          ) : status === 'idle' ? (
            <p>
              Are you sure you want to unsubscribe <strong>{email}</strong> from the Artificer's Guild newsletter?
            </p>
          ) : status === 'loading' ? (
            <p>Processing your request...</p>
          ) : status === 'success' ? (
            <p className="text-green-600 dark:text-green-400">{message}</p>
          ) : (
            <p className="text-destructive">{message}</p>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/">Return Home</Link>
          </Button>
          
          {status === 'idle' && email && (
            <Button onClick={handleUnsubscribe}>
              Confirm Unsubscribe
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}