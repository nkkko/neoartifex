import { NextRequest, NextResponse } from "next/server";

// Endpoint to access Cloudflare KV values
const endpoint = (
  key: string,
  accountID: string,
  namespaceID: string
) =>
  `https://api.cloudflare.com/client/v4/accounts/${accountID}/storage/kv/namespaces/${namespaceID}/values/${key}`;

// Test function to verify Cloudflare KV API access
export async function GET(request: NextRequest) {
  // Block access in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: "This endpoint is not available in production" },
      { status: 404 }
    );
  }

  try {
    // Extract account ID and namespace ID from environment variables
    // These should be set in your Vercel environment
    const accountID = process.env.CLOUDFLARE_ACCOUNT_ID;
    const namespaceID = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
    const apiToken = process.env.CLOUDFLARE_KV_API_TOKEN;

    // Verify that we have all the required values
    if (!accountID || !namespaceID || !apiToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required environment variables",
          missing: {
            accountID: !accountID,
            namespaceID: !namespaceID,
            apiToken: !apiToken,
          },
        },
        { status: 500 }
      );
    }

    // Test key
    const testKey = "test-key";

    // First, try to write a value to KV
    const writeResponse = await fetch(
      endpoint(testKey, accountID, namespaceID),
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: "data", timestamp: Date.now() }),
      }
    );

    const writeResult = await writeResponse.json();

    if (!writeResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to write to Cloudflare KV",
          details: writeResult,
        },
        { status: 500 }
      );
    }

    // Then, read the value back
    const readResponse = await fetch(
      endpoint(testKey, accountID, namespaceID),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Parse the response based on content type
    let readResult;
    const contentType = readResponse.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      readResult = await readResponse.json();
    } else {
      // Cloudflare KV API returns the raw value for GET requests, not wrapped in JSON
      const text = await readResponse.text();
      try {
        // Try to parse it as JSON if possible
        readResult = JSON.parse(text);
      } catch (e) {
        // Otherwise return as text
        readResult = text;
      }
    }

    return NextResponse.json({
      success: true,
      writeResult,
      readResult,
      environment: {
        accountID: accountID.substring(0, 3) + "..." + accountID.substring(accountID.length - 3), // Mask for security
        namespaceID: namespaceID.substring(0, 3) + "..." + namespaceID.substring(namespaceID.length - 3), // Mask for security
        apiToken: "✓ Present",
      },
    });
  } catch (error) {
    console.error("Error accessing Cloudflare KV:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}