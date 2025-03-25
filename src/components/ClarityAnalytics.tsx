'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export function ClarityAnalytics() {
  useEffect(() => {
    // Initialize Clarity with your project ID
    const projectId = "qtmbjp44e0";
    Clarity.init(projectId);
  }, []);

  return null;
}