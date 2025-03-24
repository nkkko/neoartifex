import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/70 to-purple-600 dark:from-primary/60 dark:to-purple-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">NeoArtifex</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Your personal library for crafting, organizing, and using powerful AI prompts. 
              Create better interactions with AI systems through thoughtfully designed prompts.
            </p>
            <div className="mt-10">
              <Button asChild size="lg">
                <Link href="/prompts">
                  Browse Prompts Library
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Use NeoArtifex?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3">Organize Your Prompts</h3>
                <p className="text-muted-foreground">
                  Save and categorize your most effective prompts with tags, versions, and metadata.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3">Improve Results</h3>
                <p className="text-muted-foreground">
                  Craft better AI interactions through structured, thoughtful prompt design.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3">Version Control</h3>
                <p className="text-muted-foreground">
                  Track the evolution of your prompts as you refine and improve them over time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}