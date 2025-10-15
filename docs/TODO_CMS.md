# CMS Setup Checklist

## Decap CMS (Current Implementation)

### ✅ Completed
- [x] CMS interface installed (`/public/admin/index.html`)
- [x] Configuration file created (`/public/admin/config.yml`)
- [x] Collections configured (work, artists, posts, events, sphere)
- [x] Media folder setup (`public/images/`)
- [x] Editorial workflow enabled

### 🔧 Required for Production

#### 1. GitHub OAuth Setup
**Why**: Decap CMS requires authentication to commit changes to your repository.

**Steps**:
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App:
   - **Application name**: WAV Studio CMS
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
3. Copy Client ID and Client Secret
4. Add to Vercel environment variables:
   - `OAUTH_CLIENT_ID`
   - `OAUTH_CLIENT_SECRET`

**Alternative**: Use Netlify Identity or Git Gateway for simpler setup.

#### 2. Update CMS Backend Configuration
Edit `/public/admin/config.yml`:

\`\`\`yaml
backend:
  name: github
  repo: your-username/your-repo-name  # ⚠️ UPDATE THIS
  branch: main
  base_url: https://api.netlify.com  # Or your OAuth provider
  auth_endpoint: auth
\`\`\`

#### 3. Test CMS Access
1. Deploy to production
2. Navigate to `https://your-domain.com/admin`
3. Click "Login with GitHub"
4. Authorize the app
5. Test creating/editing content

### 📝 Content Management Workflow

#### Adding a New Project
1. Go to `/admin`
2. Click "Work" collection
3. Click "New Work"
4. Fill in fields:
   - Title, Slug, Date
   - Tags (comma-separated)
   - Cover image (upload or select)
   - Description
   - Links (optional)
   - **Featured**: Toggle ON to show in Selected Work
5. Save draft or publish

#### Adding Sphere Images
1. Go to `/admin`
2. Click "Sphere Configuration"
3. Add/remove images from the list
4. Each image needs:
   - `src`: Path to image (e.g., `/images/cover.jpg`)
   - `alt`: Description for accessibility
5. Save changes

#### Publishing Workflow
- **Draft**: Saved but not published
- **In Review**: Ready for review
- **Ready**: Approved and ready to publish
- **Published**: Live on the site

### 🔄 Alternative CMS Options

#### Option 1: Tina CMS
**Pros**:
- Visual editing
- Better TypeScript support
- Local development mode
- No OAuth setup needed

**Cons**:
- More complex setup
- Requires Tina Cloud account (free tier available)

**Setup**:
\`\`\`bash
pnpm add tinacms @tinacms/cli
\`\`\`

#### Option 2: Sanity CMS
**Pros**:
- Powerful content modeling
- Real-time collaboration
- Excellent media handling
- GraphQL API

**Cons**:
- Requires Sanity account
- More complex data structure
- Need to refactor data loading

**Setup**:
\`\`\`bash
pnpm add @sanity/client next-sanity
\`\`\`

#### Option 3: Contentlayer (Local-First)
**Pros**:
- No external service needed
- Type-safe content
- Works with Git workflow

**Cons**:
- No visual editor
- Requires code knowledge
- Manual file editing

### 🚀 Deployment Checklist

#### Vercel Deployment
- [ ] Connect GitHub repository
- [ ] Set up OAuth app (see above)
- [ ] Add environment variables
- [ ] Configure build command: `pnpm build`
- [ ] Set output directory: `out`
- [ ] Enable automatic deployments

#### Netlify Deployment
- [ ] Connect GitHub repository
- [ ] Enable Netlify Identity (easier than OAuth)
- [ ] Update CMS config to use Git Gateway
- [ ] Configure build: `pnpm build`
- [ ] Set publish directory: `out`

### 📚 Resources

**Decap CMS**:
- Docs: https://decapcms.org/docs/
- GitHub OAuth: https://decapcms.org/docs/authentication-backends/
- Configuration: https://decapcms.org/docs/configuration-options/

**Tina CMS**:
- Docs: https://tina.io/docs/
- Setup Guide: https://tina.io/docs/setup-overview/

**Sanity**:
- Docs: https://www.sanity.io/docs
- Next.js Guide: https://www.sanity.io/guides/nextjs

### ⚠️ Important Notes

1. **Static Export Limitation**: 
   - CMS changes require rebuild/redeploy
   - No real-time updates
   - Consider using Vercel's ISR if you need dynamic updates

2. **Media Management**:
   - All images stored in `public/images/`
   - Large images should be optimized before upload
   - Consider using Cloudinary/Imgix for better performance

3. **Content Validation**:
   - Slugs must be unique and URL-safe
   - Dates must be in ISO format (YYYY-MM-DD)
   - Required fields must be filled

4. **Backup Strategy**:
   - All content is in Git (automatic backup)
   - Export CMS data regularly
   - Keep local copies of media files

### 🐛 Troubleshooting

**CMS won't load**:
- Check browser console for errors
- Verify `/admin/index.html` and `/admin/config.yml` exist
- Check network tab for failed requests

**Can't login**:
- Verify OAuth app credentials
- Check callback URL matches exactly
- Try clearing browser cache

**Changes not appearing**:
- Rebuild and redeploy the site
- Check if changes were committed to Git
- Verify branch name in CMS config

**Images not loading**:
- Check file paths (must start with `/`)
- Verify images are in `public/` directory
- Check file extensions match

### 📞 Support

For CMS-specific issues:
- Decap CMS: https://github.com/decaporg/decap-cms/discussions
- Tina CMS: https://discord.com/invite/zumN63Ybpf
- Sanity: https://slack.sanity.io/
