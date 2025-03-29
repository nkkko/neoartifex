import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Font loading
const FONT_PATH = path.join(process.cwd(), 'public', 'fonts');
const interRegular = fs.readFileSync(path.join(FONT_PATH, 'Inter-Regular.ttf'));
const interBold = fs.readFileSync(path.join(FONT_PATH, 'Inter-Bold.ttf'));

// This route generates dynamic Open Graph images for prompts
export async function GET(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  // Extract slug from the URL path directly to avoid linting error
  const url = request.url;
  const pathParts = url.split('/');
  const promptSlug = pathParts[pathParts.length - 1];
  
  try {
    // Read the markdown file
    const promptPath = path.join(process.cwd(), 'prompts', `${promptSlug}.md`);
    
    // Default values in case file reading fails
    let title = promptSlug;
    let description = '';
    let tags: string[] = [];
    let author = '';
    let version = '';
    
    try {
      // Read and parse the file with gray-matter
      const fileContent = fs.readFileSync(promptPath, 'utf8');
      const { data } = matter(fileContent);
      
      // Extract frontmatter
      title = data.title || title;
      description = data.description || '';
      tags = data.tags || [];
      author = data.author || '';
      version = data.version ? `v${data.version}` : '';
    } catch (error) {
      console.error(`Error reading prompt file for ${promptSlug}:`, error);
    }

    // Generate the OG image with custom tailwind-like styling
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '100%',
            height: '100%',
            padding: '48px 48px',
            background: 'linear-gradient(to right, #6d28d9, #9333ea)',
            color: 'white',
            fontFamily: '"Inter"',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                marginRight: '16px',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
              </svg>
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              NeoArtifex
            </span>
          </div>

          {/* Title */}
          <span
            style={{
              display: 'flex',
              fontSize: '64px',
              fontWeight: 'bold',
              marginBottom: '24px',
              maxWidth: '80%',
              lineHeight: 1.2,
            }}
          >
            {title}
          </span>

          {/* Description */}
          <span
            style={{
              display: 'flex',
              fontSize: '28px',
              marginBottom: '32px',
              maxWidth: '80%',
              lineHeight: 1.4,
              opacity: 0.9,
            }}
          >
            {description}
          </span>

          {/* Tags */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '40px',
            }}
          >
            {tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                style={{
                  display: 'flex',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '9999px',
                  padding: '6px 12px',
                  fontSize: '18px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginTop: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '20px',
              }}
            >
              {author && (
                <span style={{ display: 'flex' }}>Author: {author}</span>
              )}
              {version && (
                <span style={{ display: 'flex' }}>{version}</span>
              )}
            </div>
            <span
              style={{
                display: 'flex',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.2)',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              neoartifex.com
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: interRegular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: interBold,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    
    // Return a fallback image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '48px',
            background: 'linear-gradient(to right, #6d28d9, #9333ea)',
            color: 'white',
            fontFamily: 'sans-serif',
          }}
        >
          <span style={{ display: 'flex', fontSize: '64px', fontWeight: 'bold' }}>NeoArtifex</span>
          <span style={{ display: 'flex', fontSize: '32px', marginTop: '24px' }}>Prompts Library</span>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}