import { Metadata } from 'next';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// Static metadata for layout
export const metadata: Metadata = {
  title: 'Prompt Details',
  description: 'Advanced prompt for modern artificers',
};

export default function PromptLayout({ children }: { children: React.ReactNode }) {
  return children;
}