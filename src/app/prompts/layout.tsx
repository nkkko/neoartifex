import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prompt Library | NeoArtifex',
  description: 'Browse our collection of advanced prompts for AI systems and LLMs',
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://neoartifex.com'),
  openGraph: {
    title: 'NeoArtifex Prompt Library',
    description: 'Discover frameworks, templates, and systems that unlock AI\'s hidden capabilities',
    images: [
      {
        url: '/api/og-image', // Dynamic OG image
        width: 1200,
        height: 630,
        alt: 'NeoArtifex Prompt Library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeoArtifex Prompt Library',
    description: 'Discover frameworks, templates, and systems that unlock AI\'s hidden capabilities',
    images: ['/api/og-image'],
  },
};

export default function PromptsLayout({ children }: { children: React.ReactNode }) {
  return children;
}