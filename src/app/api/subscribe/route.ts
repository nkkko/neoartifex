import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
// In a production environment, use environment variables
const resend = new Resend(process.env.RESEND_API_KEY || 'test_key');

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Send confirmation email to the subscriber
    const { data, error } = await resend.emails.send({
      from: 'NeoArtifex <hi@neoartifex.com>',
      to: [email],
      subject: 'Welcome to the Artificer\'s Guild',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6d28d9;">Welcome to the Artificer's Guild</h1>
          <p>Thank you for joining our community of modern artificers.</p>
          <p>You'll now receive our weekly updates on AI tools, techniques, and insights that help you craft remarkable solutions.</p>
          <p>In the meantime, explore our <a href="https://neoartifex.com/prompts" style="color: #6d28d9;">Prompt Library</a> to discover frameworks, templates, and systems that unlock AI's hidden capabilities.</p>
          <p style="margin-top: 30px; font-style: italic;">"The artificer knows that tools themselves are neutral—it is the intention, skill, and wisdom of the maker that matters."</p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>NeoArtifex.com - The Modern Artificer's Guide</p>
            <p>If you didn't subscribe to our newsletter, please ignore this email.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error({ error });
      return NextResponse.json(
        { success: false, message: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    // Store email to your database here if needed
    // For this example, we're just sending the confirmation email

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully subscribed to the newsletter' 
    });
    
  } catch (error) {
    console.error('Error in subscription:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while subscribing' },
      { status: 500 }
    );
  }
}