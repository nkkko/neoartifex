import { NextRequest, NextResponse } from 'next/server';
import { getPromptBySlug, getPromptVersions } from '@/lib/api';

type Params = {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function GET(request: NextRequest, context: Params) {
  try {
    const { slug } = context.params;
    const searchParams = request.nextUrl.searchParams;
    const version = searchParams.get('version');
    
    // Get prompt with the specified version if provided
    const fileSlug = version ? `${slug}-v${version}` : slug;
    
    const prompt = getPromptBySlug(fileSlug, [
      'title',
      'description',
      'content',
      'tags',
      'created',
      'author',
      'version',
    ]);
    
    if (!prompt || Object.keys(prompt).length === 0) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }
    
    // Get all versions of this prompt
    const versions = getPromptVersions(slug);
    
    return NextResponse.json({
      prompt,
      versions,
    });
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompt' },
      { status: 500 }
    );
  }
}