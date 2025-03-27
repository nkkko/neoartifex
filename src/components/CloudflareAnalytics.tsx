import Script from 'next/script';

export function CloudflareAnalytics() {
  // Token is loaded from environment variable or falls back to empty object if not available
  const beaconData = process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN 
    ? JSON.stringify({ token: process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN }) 
    : '{}';
    
  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={beaconData}
      strategy="afterInteractive"
    />
  );
}