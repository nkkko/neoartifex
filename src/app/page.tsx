import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { NewsletterForm } from '@/components/NewsletterForm';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/70 to-purple-600 dark:from-primary/60 dark:to-purple-700 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-3">NeoArtifex: The Modern Artificer's Guide</h1>
          <p className="text-lg mb-6 italic">Where technology meets human ingenuity</p>
          <p className="text-xl max-w-2xl mx-auto mb-10">
            NeoArtifex helps ambitious builders harness AI to craft remarkable solutions. 
            For those who don't just use tools, but master them.
          </p>
          <Button asChild size="lg">
            <Link href="/prompts">
              DISCOVER THE CRAFT
            </Link>
          </Button>
        </div>
      </section>
      
      {/* The Artificer's Prompt Library */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">The Artificer's Prompt Library</h2>
          <h3 className="text-xl font-semibold mb-6">Master the Language of AI</h3>
          <p className="max-w-3xl mx-auto text-muted-foreground">
            Our curated library of advanced prompts serves as both workshop and repository for those who understand: 
            the interface between human and machine is an art form unto itself.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Browse the Prompt Library</h3>
            <p className="text-muted-foreground mb-6">
              Discover frameworks, templates, and systems that unlock AI's hidden capabilities. 
              From precise coding instructions to creative generation patterns, find prompts crafted by masters of the form.
            </p>
            <Button asChild>
              <Link href="/prompts">EXPLORE THE LIBRARY</Link>
            </Button>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Contribute Your Craft</h3>
            <p className="text-muted-foreground mb-6">
              Every artificer develops their own techniques. Share your most effective prompt designs 
              and help build a collective intelligence greater than any individual. 
              Your contributions elevate our entire community.
            </p>
            <Button asChild>
              <Link href="https://github.com/nkkko/neoartifex/blob/main/CONTRIBUTING.md" target="_blank">CONTRIBUTE YOUR CRAFT</Link>
            </Button>
          </Card>
        </div>
        
        <blockquote className="border-l-4 border-primary pl-4 italic max-w-3xl mx-auto text-center">
          "The prompt is where human intent meets artificial potential—it deserves our highest craftsmanship."
        </blockquote>
      </section>
      
      {/* About Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-3">The New Artificers' Movement</h2>
            <p className="mb-6">
              NeoArtifex—a modern craftsperson wielding AI as their chisel and code as their canvas.
            </p>
            <p className="mb-6">
              This is for the makers, the builders, the problem solvers. Those driven by the desire to create 
              something meaningful, regardless of their field or background. We explore how artificial intelligence 
              is reshaping what's possible for anyone with the vision and determination to build.
            </p>
            
            <p className="font-semibold mb-3">At NeoArtifex, we believe:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>True craftsmanship now includes mastery of AI tools</li>
              <li>The most powerful creations blend human creativity with machine capabilities</li>
              <li>Everyone deserves access to these new tools of creation</li>
              <li>The ability to shape AI systems is becoming a meta-skill that amplifies all others</li>
            </ul>
            
            <p>Join us at the intersection of ancient craftsmanship values and cutting-edge technology.</p>
          </div>
        </div>
      </section>
      
      {/* Content Pillars */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Content Pillars</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">AI Tool Mastery</h3>
            <p className="text-muted-foreground italic">
              Deep analysis of emerging LLMs, visual generators, and AI systems
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">The Artificer's Toolkit</h3>
            <p className="text-muted-foreground italic">
              Practical applications of AI-enhanced coding, development, and creation tools
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Intelligent Craftsmanship</h3>
            <p className="text-muted-foreground italic">
              Workflows and methodologies that blend human expertise with AI capabilities
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Future Craft</h3>
            <p className="text-muted-foreground italic">
              Exploring the philosophical and practical implications of this new era of making
            </p>
          </Card>
        </div>
      </section>
      
      {/* Featured Explorations */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-3 text-center">Featured Explorations</h2>
          <h3 className="text-xl font-semibold mb-12 text-center">Current Investigations</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">The Low-Code Revelation</h3>
              <p className="text-muted-foreground mb-2">
                Building Complex Systems with Minimal Code
              </p>
              <p>How AI is transforming the fundamentals of software creation</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Prompt Engineering as a Craft</h3>
              <p>The subtle art of communicating with artificial minds</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Generative Loops</h3>
              <p className="text-muted-foreground mb-2">
                Human-AI Collaboration Frameworks
              </p>
              <p>Creating systems where humans and AI amplify each other</p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Forge Your Path</h2>
          
          <p className="mb-8 text-lg">
            In every era, those who mastered new tools shaped the future. 
            The artificers of this age will build with intelligence itself.
          </p>
          
          <p className="mb-6 text-xl font-semibold">Will you be among them?</p>
          
          <div className="bg-muted/50 p-6 rounded-lg mb-10">
            <h3 className="text-xl font-semibold mb-4">Join the Artificer's Guild Newsletter</h3>
            <p className="text-muted-foreground mb-6">
              Receive weekly insights, tool discoveries, and artificer techniques directly to your inbox.
            </p>
            <NewsletterForm />
          </div>
          
          <blockquote className="border-l-4 border-primary pl-4 italic max-w-2xl mx-auto mt-8 text-center">
            "The artificer knows that tools themselves are neutral—it is the intention, skill, and wisdom of the maker that matters."
          </blockquote>
        </div>
      </section>
    </div>
  );
}