import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// In a production app, this would be a database call
// For this example, we'll write to a JSON file
const ratingsFilePath = path.join(process.cwd(), 'data', 'ratings.json');

// Ensure the data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize the ratings file if it doesn't exist
if (!fs.existsSync(ratingsFilePath)) {
  fs.writeFileSync(ratingsFilePath, JSON.stringify({}, null, 2), 'utf8');
}

type Rating = {
  like: number; // Count of likes
  dislike: number; // Count of dislikes
};

// Get all ratings
export async function GET() {
  try {
    // Read the current ratings
    const ratingsData = fs.readFileSync(ratingsFilePath, 'utf8');
    const ratings = JSON.parse(ratingsData);
    
    return NextResponse.json({ ratings });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

// Add or update a rating
export async function POST(request: NextRequest) {
  try {
    const { slug, liked } = await request.json();
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }
    
    // Read the current ratings
    const ratingsData = fs.readFileSync(ratingsFilePath, 'utf8');
    const ratings: Record<string, Rating> = JSON.parse(ratingsData);
    
    // Get or initialize rating for this prompt
    const rating = ratings[slug] || { like: 0, dislike: 0 };
    
    // Update the appropriate counter
    if (liked === true) {
      rating.like += 1;
    } else if (liked === false) {
      rating.dislike += 1;
    }
    
    // Save the updated rating
    ratings[slug] = rating;
    fs.writeFileSync(ratingsFilePath, JSON.stringify(ratings, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, rating });
  } catch (error) {
    console.error('Error saving rating:', error);
    return NextResponse.json(
      { error: 'Failed to save rating' },
      { status: 500 }
    );
  }
}