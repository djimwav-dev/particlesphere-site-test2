# WAV Studio - WIDEANGLEVISION

A modern, interactive website for WAV Studio (WIDEANGLEVISION), a recording studio in Paris. Features a stunning 3D particle sphere, portfolio showcase, artist directory, and blog-style updates.

## ✨ Features

- **Interactive 3D Sphere**: Three.js-powered particle sphere with orbiting images
- **Portfolio Showcase**: Featured work and full project gallery
- **Artist Directory**: Profiles of studio artists and collaborators
- **Updates Blog**: Articles and events with MDX support
- **CMS Integration**: Decap CMS for easy content management
- **Static Export**: Fast, SEO-friendly static site generation
- **Dark Theme**: Sleek, minimal design with Inter font
- **Fully Responsive**: Optimized for desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/particlesphere.git
cd particlesphere

# Install dependencies
pnpm install

# Start development server
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Scripts

\`\`\`bash
pnpm dev          # Start development server
pnpm build        # Build for production (outputs to /out)
pnpm start        # Start production server (after build)
pnpm lint         # Run ESLint
\`\`\`

## 📝 Content Management

### Option 1: Decap CMS (Recommended)

1. Navigate to `/admin` in your browser
2. Login with GitHub (requires OAuth setup - see below)
3. Edit content visually through the CMS interface

**First-time setup**:
- See `docs/TODO_CMS.md` for GitHub OAuth configuration
- Required for production deployment

### Option 2: Direct File Editing

Edit content files directly in your code editor:

#### Projects (`data/work/*.json`)
\`\`\`json
{
  "title": "Project Name",
  "slug": "project-slug",
  "date": "2025-01-15",
  "tags": ["mix", "mastering", "production"],
  "cover": "/images/project-cover.jpg",
  "description": "Detailed project description...",
  "links": [
    {
      "label": "Listen on Spotify",
      "url": "https://spotify.com/..."
    }
  ],
  "featured": true
}
\`\`\`

**Mark as Featured**: Set `"featured": true` to show in Selected Work page.

#### Artists (`data/artists/*.json`)
\`\`\`json
{
  "name": "Artist Name",
  "slug": "artist-slug",
  "photo": "/images/artist-photo.jpg",
  "bio": "Artist biography and background..."
}
\`\`\`

#### Blog Posts (`content/posts/*.mdx`)
\`\`\`mdx
---
title: "Post Title"
slug: "post-slug"
date: "2025-01-15"
cover: "/images/post-cover.jpg"
tags: ["studio", "production"]
excerpt: "Brief summary..."
---

Your markdown content here...
\`\`\`

#### Events (`data/events/*.json`)
\`\`\`json
{
  "title": "Event Name",
  "slug": "event-slug",
  "date": "2025-02-01",
  "location": "Paris, France",
  "cover": "/images/event-cover.jpg",
  "link": "https://tickets.com/...",
  "excerpt": "Event description..."
}
\`\`\`

#### Sphere Images (`public/sphere.json`)
\`\`\`json
{
  "images": [
    {
      "src": "/image-1.jpg",
      "alt": "Album Cover 1"
    },
    {
      "src": "/image-2.jpg",
      "alt": "Album Cover 2"
    }
  ]
}
\`\`\`

**Adding images**:
1. Place image files in `public/` directory
2. Add entry to `sphere.json` with path and alt text
3. Rebuild the site

## 🎨 Customization

### Changing Colors

Edit `app/globals.css`:

\`\`\`css
.dark {
  --background: oklch(0.145 0 0);  /* Background color */
  --foreground: oklch(0.985 0 0);  /* Text color */
  --primary: oklch(0.985 0 0);     /* Primary accent */
  /* ... other colors */
}
\`\`\`

### Adjusting Marquee Speed

Edit `app/globals.css`:

\`\`\`css
.animate-marquee {
  animation: marquee 80s linear infinite;  /* Change 80s to desired duration */
}
\`\`\`

### Modifying Sphere Settings

Edit `components/particle-sphere.tsx`:

\`\`\`tsx
// Sphere radius
const radius = 8

// Logo size
<Sprite scale={[5.5, 5.5, 1]}>

// Number of images
// Edit public/sphere.json to add/remove images
\`\`\`

## 🏗️ Project Structure

\`\`\`
particlesphere/
├── app/                    # Next.js pages
│   ├── page.tsx           # Home (3D sphere hero)
│   ├── work/              # Portfolio
│   ├── artists/           # Artist directory
│   ├── discover/          # Featured work + updates
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # React components
│   ├── particle-sphere.tsx  # 3D sphere
│   ├── site-header.tsx      # Navigation
│   └── ...
├── data/                  # Content (JSON)
│   ├── work/             # Projects
│   ├── artists/          # Artists
│   └── events/           # Events
├── content/              # Blog posts (MDX)
│   └── posts/
├── public/               # Static assets
│   ├── admin/           # CMS
│   ├── images/          # Media files
│   └── sphere.json      # Sphere configuration
└── docs/                # Documentation
    ├── SUMMARY.md       # Architecture overview
    └── TODO_CMS.md      # CMS setup guide
\`\`\`

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure build settings:
   - **Build Command**: `pnpm build`
   - **Output Directory**: `out`
4. Set up environment variables (for CMS)
5. Deploy

### Netlify

1. Connect GitHub repository
2. Configure build:
   - **Build Command**: `pnpm build`
   - **Publish Directory**: `out`
3. Enable Netlify Identity (for CMS)
4. Deploy

### Other Static Hosts

1. Run `pnpm build`
2. Upload contents of `/out` directory
3. Configure CMS backend separately

## 🔧 Configuration

### Static Export

The site is configured for static export in `next.config.mjs`:

\`\`\`js
const nextConfig = {
  output: "export",           // Generate static HTML
  images: {
    unoptimized: true,        // Required for static export
  },
  reactStrictMode: true,
}
\`\`\`

### Environment Variables

Create `.env.local` for local development:

\`\`\`env
# CMS OAuth (production only)
OAUTH_CLIENT_ID=your_github_oauth_client_id
OAUTH_CLIENT_SECRET=your_github_oauth_client_secret
\`\`\`

## 📚 Documentation

- **Architecture Overview**: `docs/SUMMARY.md`
- **CMS Setup Guide**: `docs/TODO_CMS.md`
- **Component Documentation**: See inline comments in code

## 🎯 Key Pages

- **Home** (`/`): 3D sphere hero + CTAs
- **Work** (`/work`): All projects with filtering
- **Selected Work** (`/selected-work`): Featured projects only
- **Discover** (`/discover`): Combined featured work + updates (accessible via "Découvrir" button)
- **Artists** (`/artists`): Artist directory
- **Updates** (`/updates`): Blog articles + events
- **About** (`/about`): Studio information
- **Contact** (`/contact`): Contact form/info

## 🎨 Design System

- **Font**: Inter (via Geist)
- **Colors**: Dark theme with white text
- **Spacing**: Tailwind's default scale
- **Components**: shadcn/ui + Radix UI
- **Animations**: CSS transforms (GPU-accelerated)

## ⚡ Performance

- **Static Generation**: Pre-rendered HTML for fast loading
- **Optimized 3D**: Limited DPR, demand-based rendering
- **Code Splitting**: Automatic via Next.js
- **Image Optimization**: Unoptimized for static export (consider external CDN)

## 🐛 Troubleshooting

**3D sphere not loading**:
- Check browser WebGL support
- Open console for errors
- Verify image paths in `sphere.json`

**CMS not accessible**:
- Ensure `/admin` route exists
- Check OAuth configuration
- See `docs/TODO_CMS.md`

**Build errors**:
- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall
- Check for TypeScript errors (currently ignored)

**Images not displaying**:
- Verify files are in `public/` directory
- Check file paths (must start with `/`)
- Ensure correct file extensions

## 📄 License

[Your License Here]

## 🤝 Contributing

[Your Contributing Guidelines Here]

## 📞 Support

For issues and questions:
- GitHub Issues: [your-repo/issues]
- Email: [your-email]
- Documentation: `docs/` directory

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- 3D graphics by [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- CMS powered by [Decap CMS](https://decapcms.org/)

---

**WAV Studio** - WIDEANGLEVISION
Paris, France
