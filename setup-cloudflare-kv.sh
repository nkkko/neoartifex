#!/bin/bash

# Setup script for Cloudflare KV

# Install wrangler CLI
echo "Installing Cloudflare Wrangler CLI..."
npm install -g wrangler

# Login to Cloudflare
echo "Logging in to Cloudflare (this will open a browser window)..."
wrangler login

# Install dependencies
echo "Installing project dependencies..."
npm install

# Create KV namespace
echo "Creating Cloudflare KV namespace..."
KV_OUTPUT=$(npx wrangler kv namespace create NEOARTIFEX_KV)
echo "$KV_OUTPUT"

# Extract KV namespace ID from output
KV_ID=$(echo "$KV_OUTPUT" | grep -o 'id = "[^"]*"' | awk -F'"' '{print $2}')

if [ -z "$KV_ID" ]; then
  echo "Failed to extract KV namespace ID. Please update wrangler.toml manually."
else
  # Update wrangler.toml with the KV namespace ID
  echo "Updating wrangler.toml with KV namespace ID..."
  sed -i.bak "s/# \[\[kv_namespaces\]\]/[[kv_namespaces]]/" wrangler.toml
  sed -i.bak "s/# binding = \"NEOARTIFEX_KV\"/binding = \"NEOARTIFEX_KV\"/" wrangler.toml
  sed -i.bak "s/# id = \"<your-namespace-id>\"/id = \"$KV_ID\"/" wrangler.toml
  rm -f wrangler.toml.bak
fi

echo "Setup completed! You can now run the worker locally with 'npm run worker:dev'"
echo "To deploy to Cloudflare Workers, run 'npm run worker:deploy'"