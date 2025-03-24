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