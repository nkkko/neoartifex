'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PatternedBackground } from '@/components/PatternedBackground';
import {
  FadeIn,
  SlideUp,
  StaggerContainer,
  StaggerItem,
  ScaleOnHover,
  TextReveal,
  ScrollReveal
} from '@/components/animations';
import featuredVideosData from '@/data/featured-videos.json';
import { YouTubeVideo, FeaturedVideo } from '@/types';

// Helper to generate YouTube thumbnail URL
const getThumbnailUrl = (videoId: string) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Function to fetch video data from YouTube API
async function fetchVideoData(videoId: string): Promise<YouTubeVideo | null> {
  try {
    const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      id: videoId,
      title: data.title || 'Unknown Title',
      publishedAt: data.upload_date || undefined
    };
  } catch (error) {
    console.error('Error fetching video data:', error);
    return null;
  }
}

// Initial video IDs
const initialVideos = [
  { id: 'iD-lhIhiVEs', title: 'Loading...' },
  // Add more video IDs as needed
];

export default function YouTubePage() {
  const [videos, setVideos] = useState<YouTubeVideo[]>(initialVideos);
  const [featuredVideos, setFeaturedVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videoPromises = initialVideos.map(video => fetchVideoData(video.id));
        const videoData = await Promise.all(videoPromises);
        
        // Filter out any null responses and update state
        const validVideos = videoData.filter(video => video !== null) as YouTubeVideo[];
        setVideos(validVideos);
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadFeaturedVideos = async () => {
      try {
        const featured = featuredVideosData.featured_videos as FeaturedVideo[];
        const featuredPromises = featured.map(video => fetchVideoData(video.id));
        const featuredData = await Promise.all(featuredPromises);
        
        // Filter out any null responses, add channel info, and update state
        const validFeaturedVideos = featuredData
          .filter((video, index) => video !== null)
          .map((video, index) => {
            if (video) {
              return {
                ...video,
                channel: featured[index].channel
              };
            }
            return null;
          })
          .filter(video => video !== null) as YouTubeVideo[];
          
        setFeaturedVideos(validFeaturedVideos);
      } catch (error) {
        console.error('Error loading featured videos:', error);
      } finally {
        setFeaturedLoading(false);
      }
    };

    loadVideos();
    loadFeaturedVideos();
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <PatternedBackground
        pattern="grid"
        opacity={0.1}
        patternColor="rgba(255,255,255,0.3)"
        className="bg-gradient-to-r from-purple-600 to-red-600 dark:from-purple-700 dark:to-red-700 text-white py-24"
      >
        <div className="container mx-auto px-4 text-center">
          <SlideUp>
            <h1 className="text-5xl font-bold mb-3">NeoArtifex YouTube</h1>
          </SlideUp>

          <SlideUp delay={0.2}>
            <p className="text-xl max-w-2xl mx-auto mb-10">
              Discover our collection of videos on AI tools, prompt engineering,
              and modern artificer techniques.
            </p>
          </SlideUp>

          <SlideUp delay={0.3}>
            <Button 
              asChild 
              size="lg" 
              className="transition-transform hover:scale-105 bg-red-600 hover:bg-red-700"
            >
              <Link href="https://youtube.com/@NeoArtifex" target="_blank">
                SUBSCRIBE TO CHANNEL
              </Link>
            </Button>
          </SlideUp>
        </div>
      </PatternedBackground>

      {/* Videos Section */}
      <ScrollReveal>
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <TextReveal>
              <h2 className="text-3xl font-bold mb-3">NeoArtifex Videos</h2>
            </TextReveal>

            <TextReveal delay={0.1}>
              <p className="max-w-3xl mx-auto text-muted-foreground">
                Explore our latest content showcasing AI tools, techniques, and strategies
                for the modern artificer.
              </p>
            </TextReveal>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p>Loading videos...</p>
            </div>
          ) : (
            <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <StaggerItem key={video.id}>
                  <ScaleOnHover>
                    <Card className="overflow-hidden h-full flex flex-col">
                      <div className="relative aspect-video">
                        <Link href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank">
                          <Image
                            src={getThumbnailUrl(video.id)}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                              <div className="w-0 h-0 border-t-[10px] border-b-[10px] border-l-[16px] border-t-transparent border-b-transparent border-l-red-600 ml-1"></div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold mb-4">{video.title}</h3>
                        {video.publishedAt && (
                          <p className="text-sm text-muted-foreground mb-4">
                            Published: {video.publishedAt}
                          </p>
                        )}
                        <Button 
                          asChild
                          variant="outline"
                          className="mt-auto"
                        >
                          <Link href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank">
                            Watch Video
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  </ScaleOnHover>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>
      </ScrollReveal>
      
      {/* Featured Videos Section */}
      <ScrollReveal>
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <TextReveal>
              <h2 className="text-3xl font-bold mb-3">Featured Videos</h2>
            </TextReveal>

            <TextReveal delay={0.1}>
              <p className="max-w-3xl mx-auto text-muted-foreground">
                Check out interviews and content featuring NeoArtifex on other channels.
              </p>
            </TextReveal>
          </div>

          {featuredLoading ? (
            <div className="text-center py-12">
              <p>Loading featured videos...</p>
            </div>
          ) : (
            <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVideos.map((video) => (
                <StaggerItem key={video.id}>
                  <ScaleOnHover>
                    <Card className="overflow-hidden h-full flex flex-col">
                      <div className="relative aspect-video">
                        <Link href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank">
                          <Image
                            src={getThumbnailUrl(video.id)}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                              <div className="w-0 h-0 border-t-[10px] border-b-[10px] border-l-[16px] border-t-transparent border-b-transparent border-l-red-600 ml-1"></div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                        {video.channel && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Channel: {video.channel}
                          </p>
                        )}
                        {video.publishedAt && (
                          <p className="text-sm text-muted-foreground mb-4">
                            Published: {video.publishedAt}
                          </p>
                        )}
                        <Button 
                          asChild
                          variant="outline"
                          className="mt-auto"
                        >
                          <Link href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank">
                            Watch Video
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  </ScaleOnHover>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </section>
      </ScrollReveal>

      {/* Call to Action */}
      <ScrollReveal>
        <PatternedBackground
          pattern="dots"
          opacity={0.15}
          patternColor="rgba(0,0,0,0.3)"
          className="w-full bg-white dark:bg-black py-12"
        >
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-xl font-semibold mb-4">Subscribe to NeoArtifex</h3>
            <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">
              Never miss our latest videos on AI tools, prompt engineering, and software development techniques.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-red-600 hover:bg-red-700"
            >
              <Link href="https://youtube.com/@NeoArtifex" target="_blank">
                SUBSCRIBE TO CHANNEL
              </Link>
            </Button>
          </div>
        </PatternedBackground>
      </ScrollReveal>
    </div>
  );
}