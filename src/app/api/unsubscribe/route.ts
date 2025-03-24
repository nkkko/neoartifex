import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY || 'test_key');

// Audience ID for the NeoArtifex newsletter
const AUDIENCE_ID = '6b863edc-8d84-493a-8103-2058a36504ce';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Get the contact from Resend
    const { data: contacts, error: listError } = await resend.contacts.list({
      audienceId: AUDIENCE_ID,
      email: email
    });

    if (listError) {
      console.error('Error finding contact:', listError);
      return NextResponse.json(
        { success: false, message: 'Failed to find your subscription' },
        { status: 500 }
      );
    }

    // If contact exists in the audience
    if (contacts && contacts.length > 0) {
      // Get the contact ID
      const contactId = contacts[0].id;
      
      // Update the contact to be unsubscribed
      const updateResult = await resend.contacts.update({
        audienceId: AUDIENCE_ID,
        id: contactId,
        unsubscribed: true
      });

      if (updateResult.error) {
        console.error('Error unsubscribing contact:', updateResult.error);
        return NextResponse.json(
          { success: false, message: 'Failed to unsubscribe' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'You have been successfully unsubscribed from the Artificer\'s Guild newsletter'
      });
    } else {
      // Contact not found in this audience
      return NextResponse.json({
        success: false,
        message: 'Email address not found in our subscriber list'
      }, { 
        status: 404 
      });
    }
  } catch (error) {
    console.error('Error in unsubscribe process:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while unsubscribing' },
      { status: 500 }
    );
  }
}