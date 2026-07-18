#!/bin/bash

# Genesis Git Authentication Fixer
# This script updates the local git remote to use a Personal Access Token (PAT) directly.

echo "============================================="
echo "       GENESIS GIT AUTHENTICATION FIXER      "
echo "============================================="
echo ""
echo "Since you are the admin, your credentials (token) cached on this machine"
echo "have likely expired or lack the 'repo' scope."
echo ""
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Generate a new Token (classic) with the 'repo' scope checked."
echo "3. Copy the token."
echo ""
echo -n "Paste your GitHub Personal Access Token (PAT) here and press Enter: "
read -s token
echo ""

if [ -z "$token" ]; then
    echo "Error: Token cannot be empty."
    exit 1
fi

# Get current remote URL
current_url=$(git remote get-url origin)
echo "Current remote: $current_url"

# Update remote URL with token
new_url="https://${token}@github.com/GenesisHacksGlobal/Genesis-webby.git"
git remote set-url origin "$new_url"

echo "Remote URL updated successfully!"
echo "Testing write permissions..."
echo ""

# Test push
git push --dry-run

if [ $? -eq 0 ]; then
    echo ""
    echo "============================================="
    echo "SUCCESS! Write permissions verified."
    echo "You can now push normally."
    echo "============================================="
else
    echo ""
    echo "============================================="
    echo "ERROR: Push test failed."
    echo "Please ensure:"
    echo "1. The token has the 'repo' scope checked."
    echo "2. If your org has SSO, click 'Configure SSO' next to the token on GitHub."
    echo "============================================="
    # Revert to original remote if failed
    git remote set-url origin "$current_url"
fi
