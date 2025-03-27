# NeoArtifex - LLM Prompts Library

A Next.js application for managing and displaying LLM (Large Language Model) prompts. The application allows you to store prompts as markdown files with frontmatter metadata, view them with filtering and sorting capabilities, and manage different versions of the same prompt.

## Features

- Store prompts as markdown files with frontmatter metadata
- Filter prompts by tags and favorites
- Sort prompts by date, alphabetically, or by rating
- Support for prompt versioning
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

4. Add the required environment variables:
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
   - `CLOUDFLARE_KV_NAMESPACE_ID`: The ID of your KV namespace
   - `CLOUDFLARE_KV_API_TOKEN`: Your Cloudflare API token

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

## Project Structure

- `/prompts` - Markdown files containing prompts
- `/src/app` - Next.js app router pages
- `/src/app/api` - API routes for ratings, newsletter, etc.
- `/src/components` - React components
- `/src/lib` - Utility functions and API clients
- `/src/types` - TypeScript type definitions

## Cloudflare Integration

This project uses Cloudflare KV for storing ratings and user data. See the [Cloudflare KV documentation](CLOUDFLARE_KV_API.md) for setup instructions and usage details.

## Analytics

The application integrates with:

- Cloudflare Analytics - For page views and performance metrics
- Microsoft Clarity - For user behavior analytics and session replays

## Scripts

- `npm run dev` - Run the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run linting
- `npm run worker:dev` - Run Cloudflare Worker locally
- `npm run worker:deploy` - Deploy Cloudflare Worker