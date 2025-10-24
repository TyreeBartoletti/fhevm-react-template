# GitHub Pages Deployment Guide

This guide explains how to deploy the Confidential Crop Yield Optimizer to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- The project files ready for deployment

## Deployment Steps

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `confidential-crop-yield-optimizer`)
4. Choose "Public" visibility
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Initialize Git and Push

Open your terminal/command prompt in the project directory and run:

```bash
# Navigate to the project directory
cd /path/to/confidential-crop-yield-optimizer

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Confidential Crop Yield Optimizer"

# Add your GitHub repository as remote (replace YOUR-USERNAME and YOUR-REPO)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section in the left sidebar
4. Under "Build and deployment":
   - Source: Select "GitHub Actions"
5. The site will automatically deploy using the included workflow

### Step 4: Wait for Deployment

1. Go to the "Actions" tab in your repository
2. You should see a workflow running called "Deploy to GitHub Pages"
3. Wait for it to complete (usually takes 1-2 minutes)
4. Once complete, your site will be live at:
   ```
   https://YOUR-USERNAME.github.io/YOUR-REPO/
   ```

## Updating Your Site

Whenever you want to update your site:

```bash
# Make your changes to the files

# Stage the changes
git add .

# Commit the changes
git commit -m "Description of your changes"

# Push to GitHub
git push
```

The GitHub Action will automatically redeploy your site.

## Important Files

- **index.html**: Main application file
- **.nojekyll**: Tells GitHub Pages not to use Jekyll processing
- **.github/workflows/deploy.yml**: Automated deployment configuration
- **README.md**: Project documentation
- **package.json**: Project metadata

## Troubleshooting

### Site Not Loading

- Verify GitHub Pages is enabled in repository settings
- Check that the "Deploy to GitHub Pages" action completed successfully
- Wait a few minutes for DNS propagation

### 404 Error

- Make sure `index.html` is in the root directory
- Verify the `.nojekyll` file exists
- Check that all files were pushed to GitHub

### Workflow Failing

- Check the "Actions" tab for error messages
- Ensure repository has proper permissions for GitHub Pages
- Verify the workflow file is correctly formatted

## Custom Domain (Optional)

To use a custom domain:

1. Go to repository Settings → Pages
2. Enter your custom domain under "Custom domain"
3. Add the following DNS records at your domain registrar:
   - For apex domain: A records pointing to GitHub's IPs
   - For subdomain: CNAME record pointing to `YOUR-USERNAME.github.io`

## Security Notes

- Never commit sensitive information (private keys, API secrets)
- The `.env.example` file is included as a template only
- Real environment variables should not be committed to the repository

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Git Documentation](https://git-scm.com/doc)

---

**Last Updated**: 2025-10-12
**Version**: 1.0.0
