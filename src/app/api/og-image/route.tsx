import { ImageResponse } from 'next/og';

// This route generates a default Open Graph image for the prompts library
export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            padding: '48px 48px',
            background: 'linear-gradient(to right, #6d28d9, #9333ea)',
            color: 'white',
            fontFamily: 'sans-serif',
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
              fontSize: '72px',
              fontWeight: 'bold',
              marginBottom: '24px',
              maxWidth: '80%',
              lineHeight: 1.2,
            }}
          >
            Prompt Library
          </span>

          {/* Description */}
          <span
            style={{
              display: 'flex',
              fontSize: '32px',
              marginBottom: '32px',
              maxWidth: '80%',
              lineHeight: 1.4,
              opacity: 0.9,
            }}
          >
            Advanced prompts for modern artificers
          </span>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: '100%',
              marginTop: 'auto',
            }}
          >
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
      }
    );
  } catch (error) {
    console.error('Error generating default OG image:', error);
    
    // Return a simple fallback image
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
            background: '#6d28d9',
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