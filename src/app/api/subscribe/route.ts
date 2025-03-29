import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
// In a production environment, use environment variables
const resend = new Resend(process.env.RESEND_API_KEY || 'test_key');

// Audience ID for the NeoArtifex newsletter
const AUDIENCE_ID = '6b863edc-8d84-493a-8103-2058a36504ce';

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Add subscriber to Resend audience
    const contactResult = await resend.contacts.create({
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      unsubscribed: false,
      audienceId: AUDIENCE_ID,
    });

    if (contactResult.error) {
      console.error('Error adding contact to audience:', contactResult.error);
      return NextResponse.json(
        { success: false, message: 'Failed to add to newsletter audience' },
        { status: 500 }
      );
    }

    // Send confirmation email to the subscriber
    const { data, error } = await resend.emails.send({
      from: 'NeoArtifex <hi@m.neoartifex.com>',
      to: [email],
      subject: 'Welcome to the Artificer\'s Guild',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6d28d9;">Welcome to the Artificer's Guild</h1>
          <p>${firstName ? `Hello ${firstName},` : 'Thank you'} for joining our community of modern artificers.</p>
          <p>You'll now receive our weekly updates on AI tools, techniques, and insights that help you craft remarkable solutions.</p>
          <p>In the meantime, explore our <a href="https://neoartifex.com/prompts" style="color: #6d28d9;">Prompt Library</a> to discover frameworks, templates, and systems that unlock AI's hidden capabilities.</p>
          <p style="margin-top: 30px; font-style: italic;">"The artificer knows that tools themselves are neutral—it is the intention, skill, and wisdom of the maker that matters."</p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>NeoArtifex.com - The Modern Artificer's Guide</p>
            <p>If you didn't subscribe to our newsletter, please ignore this email.</p>
            <p>You can <a href="https://neoartifex.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #6d28d9;">unsubscribe</a> at any time.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      // Note: Even if the confirmation email fails, we've already added the contact to the audience
      return NextResponse.json(
        { success: true, message: 'Subscribed, but confirmation email could not be sent' }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to the Artificer\'s Guild newsletter'
    });

  } catch (error) {
    console.error('Error in subscription:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while subscribing' },
      { status: 500 }
    );
  }
}