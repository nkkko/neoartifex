# LLM Prompts Library

A Next.js application for managing and displaying LLM (Large Language Model) prompts. The application allows you to store prompts as markdown files with frontmatter metadata, view them with filtering and sorting capabilities, and manage different versions of the same prompt.

## Features

- Store prompts as markdown files with frontmatter metadata
- Filter prompts by tags
- Sort prompts by date or alphabetically
- Support for prompt versioning
- Clean and responsive UI with Tailwind CSS
- Markdown rendering with code highlighting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

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

## Project Structure

- `/prompts` - Markdown files containing prompts
- `/src/app` - Next.js app router pages
- `/src/components` - React components
- `/src/lib` - Utility functions
- `/src/types` - TypeScript type definitions