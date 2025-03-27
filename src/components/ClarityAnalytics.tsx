'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export function ClarityAnalytics() {
  useEffect(() => {
    // Initialize Clarity with your project ID from environment variable
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    if (projectId) {
      Clarity.init(projectId);
    }
  }, []);

  return null;
}