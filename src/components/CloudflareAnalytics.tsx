import Script from 'next/script';

export function CloudflareAnalytics() {
  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon='{"token": "1324ddedfaa7417bb4c92ade268dbd27"}'
      strategy="afterInteractive"
    />
  );
}