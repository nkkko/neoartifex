#!/bin/bash

# Setup script for Cloudflare KV

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Installing Cloudflare Wrangler CLI..."
    npm install -g wrangler
    if [ $? -ne 0 ]; then
        echo "Failed to install wrangler. Please install it manually:"
        echo "npm install -g wrangler"
        exit 1
    fi
else
    echo "Wrangler CLI is already installed."
fi

# Login to Cloudflare
echo "Logging in to Cloudflare (this will open a browser window)..."
wrangler login
if [ $? -ne 0 ]; then
    echo "Failed to login to Cloudflare. Please try again manually:"
    echo "wrangler login"
    exit 1
fi

# Check if KV namespace already exists
echo "Checking existing KV namespaces..."
EXISTING_NAMESPACES=$(wrangler kv namespace list)
if echo "$EXISTING_NAMESPACES" | grep -q "NEOARTIFEX_KV"; then
    echo "KV namespace NEOARTIFEX_KV already exists."
    
    # Extract the namespace ID
    KV_ID=$(echo "$EXISTING_NAMESPACES" | grep -A1 "NEOARTIFEX_KV" | grep "id" | awk -F'"' '{print $4}')
    echo "Found existing namespace ID: $KV_ID"
else
    # Create KV namespace
    echo "Creating Cloudflare KV namespace..."
    KV_OUTPUT=$(wrangler kv namespace create NEOARTIFEX_KV)
    echo "$KV_OUTPUT"
    
    # Extract KV namespace ID from output
    KV_ID=$(echo "$KV_OUTPUT" | grep -o 'id = "[^"]*"' | awk -F'"' '{print $2}')
fi

if [ -z "$KV_ID" ]; then
    echo "Failed to extract KV namespace ID. Please update wrangler.toml manually."
    exit 1
fi

# Check if wrangler.toml exists
if [ ! -f wrangler.toml ]; then
    echo "Creating wrangler.toml..."
    cat > wrangler.toml << EOL
name = "neoartifex"
main = "src/worker-simplified.ts"
compatibility_date = "2023-01-01"

[[kv_namespaces]]
binding = "NEOARTIFEX_KV"
id = "$KV_ID"
EOL
else
    # Update existing wrangler.toml
    echo "Updating wrangler.toml with KV namespace ID..."
    
    if grep -q "kv_namespaces" wrangler.toml; then
        # KV section exists, update it
        sed -i.bak -E "s/id = \"[^\"]*\"/id = \"$KV_ID\"/" wrangler.toml
    else
        # KV section doesn't exist, add it
        cat >> wrangler.toml << EOL

[[kv_namespaces]]
binding = "NEOARTIFEX_KV"
id = "$KV_ID"
EOL
    fi
    
    # Remove backup file
    rm -f wrangler.toml.bak
fi

# Install dependencies
echo "Installing project dependencies..."
npm install

# Add scripts to package.json if they don't exist
if ! grep -q "\"worker:dev\"" package.json; then
    echo "Adding worker scripts to package.json..."
    sed -i.bak 's/"scripts": {/"scripts": {\n    "worker:dev": "wrangler dev src\/worker-simplified.ts",\n    "worker:deploy": "wrangler deploy src\/worker-simplified.ts",/' package.json
    rm -f package.json.bak
fi

echo "Setup completed! You can now:"
echo "- Run the worker locally: npm run worker:dev"
echo "- Deploy to Cloudflare Workers: npm run worker:deploy"
echo "- Test your implementation with the included test files"