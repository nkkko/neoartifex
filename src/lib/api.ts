import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Prompt } from '@/types';

const promptsDirectory = path.join(process.cwd(), 'prompts');

// Add a server-only marker to indicate this file contains server-only code
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export function getPromptSlugs() {
  // This function should only be called on the server
  if (typeof window !== 'undefined') {
    return [];
  }
  
  // Ensure directory exists
  if (!fs.existsSync(promptsDirectory)) {
    fs.mkdirSync(promptsDirectory, { recursive: true });
    return [];
  }
  
  return fs.readdirSync(promptsDirectory)
    .filter(file => /\.md$/.test(file))
    .map(file => file.replace(/\.md$/, ''));
}

export function getPromptBySlug(slug: string, fields: string[] = []): Partial<Prompt> {
  // This function should only be called on the server
  if (typeof window !== 'undefined') {
    return {};
  }
  
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(promptsDirectory, `${realSlug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return {};
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const baseSlug = realSlug.replace(/-v\d+$/, '');
  const versionMatch = realSlug.match(/-v(\d+)$/);
  const version = versionMatch ? parseInt(versionMatch[1], 10) : 1;
  
  const items: Partial<Prompt> = {};

  // Ensure only the requested fields are returned
  fields.forEach((field) => {
    if (field === 'slug') {
      items.slug = baseSlug;
    }
    else if (field === 'content') {
      items.content = content;
    }
    else if (field === 'version') {
      items.version = version;
    }
    else if (data[field]) {
      // Safely set the field with type assertion
      (items as any)[field] = data[field];
    }
  });

  return items;
}

export function getAllPrompts(fields: string[] = []): Partial<Prompt>[] {
  // This function should only be called on the server
  if (typeof window !== 'undefined') {
    return [];
  }
  
  const slugs = getPromptSlugs();
  const allPrompts = slugs
    .map((slug) => getPromptBySlug(slug, [...fields, 'slug', 'version']))
    .filter(prompt => Object.keys(prompt).length > 0);
  
  // Group prompts by base slug
  const promptGroups: Record<string, Partial<Prompt>[]> = {};
  
  allPrompts.forEach(prompt => {
    if (!prompt.slug) return;
    
    if (!promptGroups[prompt.slug]) {
      promptGroups[prompt.slug] = [];
    }
    
    promptGroups[prompt.slug].push(prompt);
  });
  
  // Get only the latest version of each prompt
  const latestPrompts = Object.values(promptGroups).map(group => {
    return group.reduce((latest, current) => {
      if (!latest.version || !current.version) return latest;
      return current.version > latest.version ? current : latest;
    }, group[0]);
  });
  
  // Sort prompts by date in descending order
  return latestPrompts
    .sort((prompt1, prompt2) => {
      if (!prompt1.created || !prompt2.created) return 0;
      return new Date(prompt2.created).getTime() - new Date(prompt1.created).getTime();
    });
}

export function getPromptVersions(baseSlug: string): number[] {
  // This function should only be called on the server
  if (typeof window !== 'undefined') {
    return [1];
  }
  
  const slugs = getPromptSlugs();
  
  // Filter slugs that match the base slug pattern
  const versionRegex = new RegExp(`^${baseSlug}(?:-v(\\d+))?$`);
  
  const versions = slugs
    .filter(slug => versionRegex.test(slug))
    .map(slug => {
      const match = slug.match(/-v(\d+)$/);
      return match ? parseInt(match[1], 10) : 1; // Default to version 1 if no suffix
    })
    .sort((a, b) => a - b);
  
  return versions.length > 0 ? versions : [1]; // Return [1] if no versions found
}