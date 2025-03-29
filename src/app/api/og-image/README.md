# Open Graph Image Generation

This directory contains the API routes for generating Open Graph images for prompts. These images are used for social media sharing.

## Routes

- `/api/og-image` - Generates a default OG image for the prompts library
- `/api/og-image/[slug]` - Generates a dynamic OG image for a specific prompt based on its slug

## How it works

The OG images are generated on-the-fly using Next.js's built-in `ImageResponse` API. This allows us to create dynamic images that include information from the prompts, such as title, description, tags, etc.

For each prompt, we read its markdown file, extract the frontmatter, and use that data to generate a custom image. The image follows a similar style to the GitHub repository cards, featuring:

- The prompt title
- Description
- Tags
- Author and version information
- NeoArtifex branding

## Requirements

- The font files (`Inter-Regular.ttf` and `Inter-Bold.ttf`) should be present in the `/public/fonts` directory.
- Each prompt must have a valid slug that matches its markdown filename.

## Implementation Details

- We use the Next.js App Router's metadata API to define the OG images for SEO.
- For individual prompts, we use a dynamic route parameter (`[slug]`) to identify which prompt to generate an image for.
- The layout.tsx files handle setting the metadata for both the prompts library page and individual prompt pages.