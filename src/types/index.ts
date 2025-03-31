export interface Prompt {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  version: number;
  created: string;
  content: string;
  author?: string; // Adding optional author field
}

// Define YouTube related types
export interface YouTubeVideo {
  id: string;
  title: string;
  publishedAt?: string;
  channel?: string;
}

export interface FeaturedVideo {
  id: string;
  channel: string;
  title?: string;
}