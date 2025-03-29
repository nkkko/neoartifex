# Fonts for Open Graph Image Generation

This document explains how to set up the required fonts for generating Open Graph images in the NeoArtifex application.

## Important Implementation Notes

When working with the Next.js Image Response API for OG images, there are several important considerations:

1. Use `<span>` elements with `display: flex` instead of `<div>` elements when containing a single text node. The API requires that all elements with multiple children have explicit display properties.

2. Make sure to set the `metadataBase` property in your layout.tsx files to ensure that OG image URLs are properly resolved, especially when working across different environments (development, production, etc.).

## Required Fonts

The OG image generation API uses the Inter font family. You'll need to download these font files:

1. Inter-Regular.ttf
2. Inter-Bold.ttf

## Installation Steps

1. Download the font files from the official Inter repository:
   - Visit [https://github.com/rsms/inter/releases](https://github.com/rsms/inter/releases)
   - Download the latest release

2. Extract the downloaded zip file

3. From the extracted files, locate the following files:
   - `Inter-Regular.ttf`
   - `Inter-Bold.ttf`

4. Place these files in the `/public/fonts` directory in your project

## Verifying Installation

Make sure the files are accessible at:
- `/public/fonts/Inter-Regular.ttf`
- `/public/fonts/Inter-Bold.ttf`

## Troubleshooting

If OG images fail to generate or display default fallback styles:

1. Verify that the font files exist in the correct location
2. Check server logs for any font loading errors
3. Ensure the font files are correctly named and formatted

## Alternative Font Options

If you wish to use different fonts, you can modify the OG image generation code in:
- `/src/app/api/og-image/[slug]/route.tsx`
- `/src/app/api/og-image/route.tsx`

Replace the font loading and font family references with your preferred fonts.