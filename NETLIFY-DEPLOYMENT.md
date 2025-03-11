# Netlify Deployment Guide

This guide will walk you through deploying your React application on Netlify.

## Setup Complete

Your project has been configured for Netlify deployment with the following files:

1. `netlify.toml` - Configuration for builds and redirects
2. `.env.production` - Environment variables for production build
3. `.npmrc` - PNPM configuration for Netlify compatibility

## Deploying to Netlify

### Option 1: Deploying via the Netlify UI (recommended for first-time setup)

1. **Push your code to Git**

   - Commit all changes to your repository
   - Push to GitHub, GitLab, or Bitbucket

2. **Sign up/Log in to Netlify**

   - Go to [netlify.com](https://www.netlify.com/) and sign up or log in

3. **Create a new site**

   - Click "New site from Git"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Netlify to access your repositories
   - Select your repository

4. **Configure build settings**

   - Build command: `pnpm build` (this is already set in netlify.toml)
   - Publish directory: `dist` (this is already set in netlify.toml)
   - Click "Advanced" and add any additional environment variables if needed
   - Click "Deploy site"

5. **Wait for the build to finish**

   - Netlify will build and deploy your site
   - You'll get a random URL like `https://random-name-123456.netlify.app`

6. **Set up a custom domain (optional)**
   - Go to "Domain settings" in your site dashboard
   - Click "Add custom domain"
   - Follow the instructions to configure your domain

### Option 2: Using Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Initialize your project**

   ```bash
   netlify init
   ```

4. **Deploy your site**
   ```bash
   netlify deploy --prod
   ```

## Testing Locally

Before deploying, you can test your site locally:

1. **Install Netlify CLI if you haven't already**

   ```bash
   npm install -g netlify-cli
   ```

2. **Run the local development server**
   ```bash
   netlify dev
   ```

This will start a local server that simulates the Netlify environment.

## Understanding the Setup

### The Environment Variables

The `.env.production` file sets `VITE_APP_API_SERVER_URL` to point to your external API endpoint. This ensures your frontend code communicates with your backend API.

## Next Steps

- Consider setting up a CI/CD pipeline for automated deployments
- Explore Netlify Forms for handling form submissions without a backend
- Look into Netlify Identity for user authentication

## Troubleshooting

If your deployment fails, check:

1. The Netlify build logs for errors
2. That all dependencies are correctly installed
3. That your environment variables are correctly set

If you need further help, you can:

- Check the [Netlify documentation](https://docs.netlify.com/)
- Ask questions in the [Netlify community forums](https://answers.netlify.com/)
- Contact Netlify support through their website
