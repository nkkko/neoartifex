import { NextResponse } from 'next/server';
import { getAllPrompts } from '@/lib/api';

export async function GET() {
  try {
    const prompts = getAllPrompts([
      'title',
      'description',
      'tags',
      'created',
      'author',
      'version',
    ]);
    
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}