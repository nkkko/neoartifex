# NeoArtifex - LLM Prompts Library

A Next.js application for managing and displaying LLM (Large Language Model) prompts. The application allows you to store prompts as markdown files with frontmatter metadata, view them with filtering and sorting capabilities, and manage different versions of the same prompt.

## Features

- Store prompts as markdown files with frontmatter metadata
- Filter prompts by tags and favorites
- Sort prompts by date, alphabetically, or by rating
- Support for prompt versioning
- Dynamic Open Graph images for social media sharing
- Interactive prompt ratings system (likes/dislikes)
- Newsletter subscription feature
- YouTube video integration
- Clean and responsive UI with Tailwind CSS and animations
- Markdown rendering with code highlighting
- Light/dark mode support
- Analytics integrations (Cloudflare, Microsoft Clarity)
- Cloudflare KV storage integration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for KV storage)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up Cloudflare KV (see [CLOUDFLARE_KV_API.md](CLOUDFLARE_KV_API.md) for details)

4. Add the required environment variables to your `.env.local` file:
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
   - `CLOUDFLARE_KV_NAMESPACE_ID`: The ID of your KV namespace
   - `CLOUDFLARE_KV_API_TOKEN`: Your Cloudflare API token
   - `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`: Your Cloudflare Analytics token
   - `NEXT_PUBLIC_CLARITY_PROJECT_ID`: Your Microsoft Clarity project ID
   - `RESEND_API_KEY`: Your Resend API key for email functionality

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Adding Prompts

Prompts are stored as markdown files in the `/prompts` directory. Each prompt file should include frontmatter metadata in the following format:

```markdown
---
title: Your Prompt Title
description: A brief description of what this prompt does
tags: [tag1, tag2, tag3]
version: 1
created: '2023-01-01'
---

# Your Prompt Content Here

## Instructions

Your detailed prompt instructions go here...
```

### Versioning Prompts

To create a new version of an existing prompt, create a new file with the same base name plus a version suffix:

- Original: `prompt-name.md`
- Version 2: `prompt-name-v2.md`
- Version 3: `prompt-name-v3.md`

Make sure to update the `version` field in the frontmatter to match the filename suffix.

## Key Features

### Ratings System

The application includes an interactive ratings system that allows users to like or dislike prompts. Ratings are stored in Cloudflare KV storage and help users identify the most valuable prompts.

### Newsletter Subscription

Users can subscribe to the NeoArtifex newsletter to receive updates about new prompts and features.

### YouTube Integration

The `/youtube` page showcases videos from the NeoArtifex YouTube channel on AI tools, prompt engineering, and modern artificer techniques.

### Dynamic Open Graph Images

The application generates dynamic Open Graph images for social media sharing. When users share links to prompts on platforms like Twitter, LinkedIn, or Facebook, those platforms display a rich preview with a custom-generated image that includes:

- The prompt title
- Description
- Tags
- Author and version information
- NeoArtifex branding

The images are generated on-the-fly using Next.js's built-in `ImageResponse` API and follow a similar style to GitHub repository cards. This enhances the visual appeal of shared content and provides more context about the prompt being shared.

## Project Structure

- `/prompts` - Markdown files containing prompts
- `/src/app` - Next.js app router pages
- `/src/app/api` - API routes for ratings, newsletter, etc.
- `/src/app/api/og-image` - API routes for Open Graph image generation
- `/src/components` - React components
- `/src/lib` - Utility functions and API clients
- `/src/types` - TypeScript type definitions
- `/public/fonts` - Font files used for OG image generation

## Cloudflare Integration

This project uses Cloudflare KV for storing ratings and user data. See the [Cloudflare KV documentation](CLOUDFLARE_KV_API.md) for setup instructions and usage details.

## Analytics

The application integrates with:

- Cloudflare Analytics - For page views and performance metrics
- Microsoft Clarity - For user behavior analytics and session replays

## Deployment on Vercel

### Setting Up Environment Variables in Vercel

When deploying to Vercel, you need to configure the environment variables in the Vercel dashboard:

1. Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on the project you want to configure
3. Navigate to the "Settings" tab
4. Select "Environment Variables" from the left sidebar
5. Add each environment variable by entering the name and value, then click "Add"
6. Add the following environment variables:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_KV_NAMESPACE_ID`
   - `CLOUDFLARE_KV_API_TOKEN`
   - `NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN`
   - `NEXT_PUBLIC_CLARITY_PROJECT_ID`
   - `RESEND_API_KEY`
7. Click "Save" to apply the changes
8. Redeploy your application for the changes to take effect

![Vercel Environment Variables](https://vercel.com/docs/storage/images/storage-env-vars.png)

Note: Environment variables prefixed with `NEXT_PUBLIC_` will be exposed to the browser. Only use this prefix for non-sensitive data that needs to be accessed by client-side code.

## Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run linting
- `npm run worker:dev` - Run Cloudflare Worker locally
- `npm run worker:deploy` - Deploy Cloudflare Worker