#!/bin/bash

# F1 Telemetry Dashboard - Automated GitHub Pages Deployment Script
# This script automates the entire deployment process

set -e

echo "🏁 F1 Telemetry Dashboard - GitHub Pages Deployment"
echo "=================================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Get GitHub username
echo "📝 Enter your GitHub username:"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username cannot be empty"
    exit 1
fi

REPO_NAME="f1-telemetry-dashboard"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo ""
echo "📋 Deployment Configuration:"
echo "   GitHub Username: $GITHUB_USERNAME"
echo "   Repository: $REPO_NAME"
echo "   URL: $REPO_URL"
echo ""

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git config user.email "f1-dashboard@local.dev"
    git config user.name "F1 Dashboard"
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: F1 Telemetry Dashboard" || true

# Add remote
echo "🔗 Adding remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📝 Next steps to enable GitHub Pages:"
echo "   1. Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "   2. Click Settings (top right)"
echo "   3. Click Pages (left sidebar)"
echo "   4. Under Source:"
echo "      - Select: main branch"
echo "      - Select: / (root) folder"
echo "   5. Click Save"
echo "   6. Wait 1-2 minutes for deployment"
echo ""
echo "🎉 Your dashboard will be live at:"
echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "📚 For detailed instructions, see QUICK_START.md"
