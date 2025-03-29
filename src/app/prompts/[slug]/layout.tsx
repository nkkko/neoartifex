import { Metadata, ResolvingMetadata } from 'next';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata(
  context: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Using segment from URL path to determine slug rather than params to avoid linting error
  const pathname = new URL((await parent).alternates?.canonical || 'http://localhost/prompts/unknown').pathname;
  const pathParts = pathname.split('/');
  const promptSlug = pathParts[pathParts.length - 1];
  
  // Default values
  let title = 'Prompt Details';
  let description = 'NeoArtifex Prompt Library';
  
  try {
    // Read the markdown file directly
    const promptPath = path.join(process.cwd(), 'prompts', `${promptSlug}.md`);
    
    if (fs.existsSync(promptPath)) {
      const fileContent = fs.readFileSync(promptPath, 'utf8');
      const { data } = matter(fileContent);
      
      // Extract frontmatter
      title = data.title || title;
      description = data.description || description;
    }
  } catch (error) {
    console.error(`Error reading prompt metadata for slug: ${promptSlug}`, error);
  }
  
  // Construct OG image URL - absolute URL will be handled by Next.js
  const ogImageUrl = `/api/og-image/${promptSlug}`;
  
  // Get metadata base from parent
  const previousMetadata = await parent;
  
  // Create metadata object
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function PromptLayout({ children }: { children: React.ReactNode }) {
  return children;
}