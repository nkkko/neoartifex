import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { NewsletterForm } from '@/components/NewsletterForm';
import { 
  FadeIn, 
  SlideUp, 
  StaggerContainer, 
  StaggerItem, 
  ScaleOnHover,
  TextReveal,
  ScrollReveal
} from '@/components/animations';

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/70 to-purple-600 dark:from-primary/60 dark:to-purple-700 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <SlideUp>
            <h1 className="text-5xl font-bold mb-3">NeoArtifex: The Modern Artificer&apos;s Guide</h1>
          </SlideUp>
          
          <SlideUp delay={0.1}>
            <p className="text-lg mb-6 italic">Where technology meets human ingenuity</p>
          </SlideUp>

          <SlideUp delay={0.2}>
            <p className="text-xl max-w-2xl mx-auto mb-10">
              NeoArtifex helps ambitious builders harness AI to craft remarkable solutions.
              For those who don&apos;t just use tools, but master them.
            </p>
          </SlideUp>

          <SlideUp delay={0.3}>
            <Button asChild size="lg" className="transition-transform hover:scale-105">
              <Link href="/prompts">
                DISCOVER THE CRAFT
              </Link>
            </Button>
          </SlideUp>
        </div>
      </section>

      {/* The Artificer's Prompt Library */}
      <ScrollReveal>
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <TextReveal>
              <h2 className="text-3xl font-bold mb-3">The Artificer&apos;s Prompt Library</h2>
            </TextReveal>
            
            <TextReveal delay={0.1}>
              <h3 className="text-xl font-semibold mb-6">Master the Language of AI</h3>
            </TextReveal>

            <TextReveal delay={0.2}>
              <p className="max-w-3xl mx-auto text-muted-foreground">
                Our curated library of advanced prompts serves as both workshop and repository for those who understand:
                the interface between human and machine is an art form unto itself.
              </p>
            </TextReveal>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <ScaleOnHover>
              <Card className="p-6 h-full">
                <h3 className="text-xl font-semibold mb-3">Browse the Prompt Library</h3>
                <p className="text-muted-foreground mb-6">
                  Discover frameworks, templates, and systems that unlock AI&apos;s hidden capabilities.
                  From precise coding instructions to creative generation patterns, find prompts crafted by masters of the form.
                </p>
                <div className="mt-auto">
                  <Button asChild>
                    <Link href="/prompts">EXPLORE THE LIBRARY</Link>
                  </Button>
                </div>
              </Card>
            </ScaleOnHover>

            <ScaleOnHover>
              <Card className="p-6 h-full">
                <h3 className="text-xl font-semibold mb-3">Contribute Your Craft</h3>
                <p className="text-muted-foreground mb-6">
                  Every artificer develops their own techniques. Share your most effective prompt designs
                  and help build a collective intelligence greater than any individual.
                  Your contributions elevate our entire community.
                </p>
                <div className="mt-auto">
                  <Button asChild>
                    <Link href="https://github.com/nkkko/neoartifex/blob/main/CONTRIBUTING.md" target="_blank">CONTRIBUTE YOUR CRAFT</Link>
                  </Button>
                </div>
              </Card>
            </ScaleOnHover>
          </div>

          <FadeIn delay={0.4}>
            <blockquote className="border-l-4 border-primary pl-4 italic max-w-3xl mx-auto text-center">
              "The prompt is where human intent meets artificial potential—it deserves our highest craftsmanship."
            </blockquote>
          </FadeIn>
        </section>
      </ScrollReveal>

      {/* About Section */}
      <ScrollReveal>
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <TextReveal>
                <h2 className="text-3xl font-bold mb-3">The New Artificers&apos; Movement</h2>
              </TextReveal>
              
              <TextReveal delay={0.1}>
                <p className="mb-6">
                  NeoArtifex—a modern craftsperson wielding AI as their chisel and code as their canvas.
                </p>
              </TextReveal>
              
              <TextReveal delay={0.2}>
                <p className="mb-6">
                  This is for the makers, the builders, the problem solvers. Those driven by the desire to create
                  something meaningful, regardless of their field or background. We explore how artificial intelligence
                  is reshaping what&apos;s possible for anyone with the vision and determination to build.
                </p>
              </TextReveal>

              <TextReveal delay={0.3}>
                <p className="font-semibold mb-3">At NeoArtifex, we believe:</p>
              </TextReveal>
              
              <StaggerContainer staggerDelay={0.1} containerDelay={0.4}>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <StaggerItem>
                    <li>True craftsmanship now includes mastery of AI tools</li>
                  </StaggerItem>
                  <StaggerItem>
                    <li>The most powerful creations blend human creativity with machine capabilities</li>
                  </StaggerItem>
                  <StaggerItem>
                    <li>Everyone deserves access to these new tools of creation</li>
                  </StaggerItem>
                  <StaggerItem>
                    <li>The ability to shape AI systems is becoming a meta-skill that amplifies all others</li>
                  </StaggerItem>
                </ul>
              </StaggerContainer>

              <TextReveal delay={0.8}>
                <p>Join us at the intersection of ancient craftsmanship values and cutting-edge technology.</p>
              </TextReveal>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Content Pillars */}
      <ScrollReveal>
        <section className="container mx-auto px-4">
          <TextReveal>
            <h2 className="text-3xl font-bold mb-12 text-center">Content Pillars</h2>
          </TextReveal>

          <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StaggerItem>
              <ScaleOnHover>
                <Card className="p-6 h-full">
                  <h3 className="text-xl font-semibold mb-3">AI Tool Mastery</h3>
                  <p className="text-muted-foreground italic">
                    Deep analysis of emerging LLMs, visual generators, and AI systems
                  </p>
                </Card>
              </ScaleOnHover>
            </StaggerItem>

            <StaggerItem>
              <ScaleOnHover>
                <Card className="p-6 h-full">
                  <h3 className="text-xl font-semibold mb-3">The Artificer&apos;s Toolkit</h3>
                  <p className="text-muted-foreground italic">
                    Practical applications of AI-enhanced coding, development, and creation tools
                  </p>
                </Card>
              </ScaleOnHover>
            </StaggerItem>

            <StaggerItem>
              <ScaleOnHover>
                <Card className="p-6 h-full">
                  <h3 className="text-xl font-semibold mb-3">Intelligent Craftsmanship</h3>
                  <p className="text-muted-foreground italic">
                    Workflows and methodologies that blend human expertise with AI capabilities
                  </p>
                </Card>
              </ScaleOnHover>
            </StaggerItem>

            <StaggerItem>
              <ScaleOnHover>
                <Card className="p-6 h-full">
                  <h3 className="text-xl font-semibold mb-3">Future Craft</h3>
                  <p className="text-muted-foreground italic">
                    Exploring the philosophical and practical implications of this new era of making
                  </p>
                </Card>
              </ScaleOnHover>
            </StaggerItem>
          </StaggerContainer>
        </section>
      </ScrollReveal>

      {/* Featured Explorations */}
      <ScrollReveal>
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <TextReveal>
              <h2 className="text-3xl font-bold mb-3 text-center">Featured Explorations</h2>
            </TextReveal>
            
            <TextReveal delay={0.1}>
              <h3 className="text-xl font-semibold mb-12 text-center">Current Investigations</h3>
            </TextReveal>

            <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-3 gap-8">
              <StaggerItem>
                <ScaleOnHover>
                  <Card className="p-6 h-full">
                    <h3 className="text-xl font-semibold mb-3">The Low-Code Revelation</h3>
                    <p className="text-muted-foreground mb-2">
                      Building Complex Systems with Minimal Code
                    </p>
                    <p>How AI is transforming the fundamentals of software creation</p>
                  </Card>
                </ScaleOnHover>
              </StaggerItem>

              <StaggerItem>
                <ScaleOnHover>
                  <Card className="p-6 h-full">
                    <h3 className="text-xl font-semibold mb-3">Prompt Engineering as a Craft</h3>
                    <p>The subtle art of communicating with artificial minds</p>
                  </Card>
                </ScaleOnHover>
              </StaggerItem>

              <StaggerItem>
                <ScaleOnHover>
                  <Card className="p-6 h-full">
                    <h3 className="text-xl font-semibold mb-3">Generative Loops</h3>
                    <p className="text-muted-foreground mb-2">
                      Human-AI Collaboration Frameworks
                    </p>
                    <p>Creating systems where humans and AI amplify each other</p>
                  </Card>
                </ScaleOnHover>
              </StaggerItem>
            </StaggerContainer>
            
            <FadeIn delay={0.6}>
              <blockquote className="border-l-4 border-primary pl-4 italic max-w-2xl mx-auto mt-12 text-center">
                "The artificer knows that tools themselves are neutral—it is the intention, skill, and wisdom of the maker that matters."
              </blockquote>
            </FadeIn>
          </div>
        </section>
      </ScrollReveal>

      {/* Call to Action */}
      <ScrollReveal>
        <section className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <TextReveal>
              <h2 className="text-3xl font-bold mb-6">Forge Your Path</h2>
            </TextReveal>

            <TextReveal delay={0.1}>
              <p className="mb-8 text-lg">
                In every era, those who mastered new tools shaped the future.
                The artificers of this age will build with intelligence itself.
              </p>
            </TextReveal>

            <SlideUp delay={0.2}>
              <div className="bg-muted/50 p-6 rounded-lg mb-10">
                <h3 className="text-xl font-semibold mb-4">Join the Artificer&apos;s Guild Newsletter</h3>
                <p className="text-muted-foreground mb-6">
                  Receive weekly insights, tool discoveries, and artificer techniques directly to your inbox.
                </p>
                <NewsletterForm />
              </div>
            </SlideUp>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}