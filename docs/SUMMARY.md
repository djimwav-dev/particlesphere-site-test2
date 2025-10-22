# WAV Studio - Project Summary

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 14.2.25 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9 + tw-animate-css
- **3D Graphics**: React Three Fiber 9.3.0 + Three.js 0.180.0 + Drei 10.7.6
- **UI Components**: Radix UI + shadcn/ui
- **Build**: Static Export (`output: "export"`)

### Project Structure

\`\`\`
particlesphere/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with fonts & theme
│   ├── page.tsx                 # Home with 3D sphere hero
│   ├── work/                    # Work portfolio
│   │   ├── page.tsx            # Grid of all projects
│   │   ├── [slug]/page.tsx     # Project detail (static)
│   │   └── loading.tsx         # Loading state
│   ├── artists/                 # Artists directory
│   │   ├── page.tsx            # Grid of all artists
│   │   └── [slug]/page.tsx     # Artist detail (static)
│   ├── discover/                # Combined featured work + updates
│   │   └── page.tsx            # Accessible via "Découvrir" CTA
│   ├── selected-work/           # Featured projects only
│   │   └── page.tsx            
│   ├── updates/                 # Blog-style updates
│   │   └── page.tsx            # Articles + Events tabs
│   ├── posts/[slug]/            # Article detail pages
│   ├── events/[slug]/           # Event detail pages
│   ├── about/page.tsx           # About page
│   ├── contact/page.tsx         # Contact page
│   └── globals.css              # Global styles + animations
│
├── components/                   # React components
│   ├── particle-sphere.tsx      # 3D sphere with orbiting images
│   ├── scene.tsx                # Canvas wrapper for R3F
│   ├── site-header.tsx          # Sticky header (3-zone layout)
│   ├── header-marquee.tsx       # Scrolling text marquee
│   ├── site-footer.tsx          # Footer component
│   ├── project-card.tsx         # Work project card
│   ├── artist-card.tsx          # Artist card
│   ├── post-card.tsx            # Blog post card
│   ├── event-card.tsx           # Event card
│   └── ui/                      # shadcn/ui components
│
├── data/                         # Content data (JSON)
│   ├── work/exemple.json        # Project data
│   ├── artists/exemple.json     # Artist data
│   └── events/showcase.json     # Event data
│
├── content/                      # MDX content
│   └── posts/hello-world.mdx    # Blog posts
│
├── public/                       # Static assets
│   ├── admin/                   # Decap CMS
│   │   ├── index.html          # CMS interface
│   │   └── config.yml          # CMS configuration
│   ├── sphere.json              # Sphere images config
│   ├── logo.png                 # Center logo
│   ├── image-*.jpg              # Sphere orbiting images
│   └── *.jpg                    # Other images
│
├── lib/utils.ts                  # Utility functions
├── hooks/                        # React hooks
├── next.config.mjs              # Next.js configuration
└── package.json                 # Dependencies
\`\`\`

## Key Features

### 1. Home Page Hero
- **3D Particle Sphere**: Interactive Three.js sphere with 15 orbiting images
- **Center Logo**: Rotating logo at sphere center (5.5 units, flipped 180°)
- **Dynamic Import**: Scene loaded client-side only (`ssr: false`)
- **Performance**: `dpr={[1, 1.5]}`, `frameloop="demand"` for optimization
- **CTAs**: "Découvrir" (→ /discover) and "Get in touch" (→ /contact)

### 2. Navigation
**Header Structure** (3-zone layout):
- **Left**: Work, Artists links
- **Center**: Scrolling marquee with studio services
  - Text: "WIDEANGLEVISION STUDIO SOUND DESIGN MIX MASTERING..."
  - Animation: 80s continuous scroll, pauses on hover
  - Typography: `font-black text-lg tracking-[0.2em]`
- **Right**: About, Contact links
- **Mobile**: Stacked layout with centered navigation

**Marquee Keywords**:
WIDEANGLEVISION STUDIO • SOUND DESIGN • MIX • MASTERING • VOCAL PRODUCTION • ARRANGEMENTS • RECORDING • LIVE STREAM • CREATIVE HUB • BEATMAKING • IMMERSIVE SOUND • SYNC • EXPERIENCE

### 3. Content Pages

**Work** (`/work`):
- Grid layout (3 cols desktop, 2 tablet, 1 mobile)
- Client-side filtering by tags
- Links to individual project pages

**Artists** (`/artists`):
- Grid of artist cards
- Links to artist detail pages

**Discover** (`/discover`):
- Combined view: Featured Work + Updates
- Tabs: All, Work, Articles, Events
- Accessible only via "Découvrir" button (not in header)

**Selected Work** (`/selected-work`):
- Filters projects where `featured === true`
- Same grid layout as /work

**Updates** (`/updates`):
- Blog-style page with tabs
- Articles from `content/posts/*.mdx`
- Events from `data/events/*.json`

### 4. Data Flow

**Projects** (`data/work/*.json`):
\`\`\`json
{
  "title": "Project Name",
  "slug": "project-slug",
  "date": "2025-01-15",
  "tags": ["mix", "mastering"],
  "cover": "/images/project.jpg",
  "description": "...",
  "links": [{"label": "Listen", "url": "..."}],
  "featured": false
}
\`\`\`

**Artists** (`data/artists/*.json`):
\`\`\`json
{
  "name": "Artist Name",
  "slug": "artist-slug",
  "photo": "/images/artist.jpg",
  "bio": "..."
}
\`\`\`

**Sphere Images** (`public/sphere.json`):
\`\`\`json
{
  "images": [
    {"src": "/image-1.jpg", "alt": "Cover 01"}
  ]
}
\`\`\`

### 5. Static Export

**Configuration** (`next.config.mjs`):
- `output: "export"` - Generates static HTML
- `images: { unoptimized: true }` - No image optimization
- `reactStrictMode: true`

**Dynamic Routes**:
All dynamic routes implement:
\`\`\`tsx
export const dynamic = "error" // Force static generation
export async function generateStaticParams() {
  return items.map(item => ({ slug: item.slug }))
}
\`\`\`

**Build Output**: `/out` directory with static HTML/CSS/JS

### 6. CMS Integration (Decap)

**Access**: `/admin` (requires GitHub OAuth setup)

**Collections**:
- **Work**: `data/work/*.json`
- **Artists**: `data/artists/*.json`
- **Posts**: `content/posts/*.mdx`
- **Events**: `data/events/*.json`
- **Sphere**: `public/sphere.json` (single file)

**Media**: `public/images/` folder

## Performance Considerations

### 3D Sphere Optimization
- **Device Pixel Ratio**: Limited to `[1, 1.5]` to reduce GPU load
- **Frame Loop**: `demand` mode - only renders when needed
- **Client-Only**: Dynamic import with `ssr: false` prevents server rendering
- **Texture Loading**: Uses `useTexture` hook with proper error handling

### Image Optimization
- All images unoptimized for static export
- Proper `alt` attributes for accessibility
- Responsive sizing with Tailwind classes

### Animation Performance
- Marquee uses CSS `transform` (GPU-accelerated)
- `will-change: transform` for smooth scrolling
- Pause on hover to reduce CPU usage

## Development Workflow

### Local Development
\`\`\`bash
pnpm install
pnpm dev          # http://localhost:3000
\`\`\`

### Build & Export
\`\`\`bash
pnpm build        # Generates /out directory
\`\`\`

### Content Editing
1. **Via CMS**: Navigate to `/admin` (requires GitHub OAuth)
2. **Direct Edit**: Modify JSON/MDX files in `data/` and `content/`
3. **Sphere Images**: Edit `public/sphere.json`

### Adding Featured Projects
Set `"featured": true` in project JSON file

## Technical Notes

### React Three Fiber
- All R3F hooks must be inside `<Canvas>` component
- `particle-sphere.tsx` wrapped by `scene.tsx` with Canvas
- Uses `useFrame` for rotation animation
- Uses `useTexture` for image loading

### Tailwind CSS v4
- Configuration in `app/globals.css` via `@theme inline`
- Custom animations in `@layer utilities`
- Dark mode via `.dark` class

### TypeScript
- Strict mode disabled for build (`ignoreBuildErrors: true`)
- Type definitions in component props

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set up Decap CMS OAuth app
3. Add environment variables (if needed)
4. Deploy automatically on push

### Static Hosting
1. Run `pnpm build`
2. Upload `/out` directory to any static host
3. Configure CMS backend for Git Gateway

## Accessibility

- Semantic HTML (`<main>`, `<header>`, `<footer>`)
- ARIA labels on interactive elements
- Focus states on all clickable elements
- Alt text on all images
- Keyboard navigation support

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- WebGL support required for 3D sphere
- Fallback: Sphere won't render without WebGL

## Known Limitations

1. **Single Example Files**: Only one example per collection (work, artists, events)
2. **No Search**: No global search functionality
3. **No Pagination**: All items loaded at once
4. **CMS Auth**: Requires GitHub OAuth setup for production
5. **Static Only**: No server-side features (API routes, ISR, etc.)

## Future Enhancements

See `docs/TODO_CMS.md` for CMS setup checklist and `README.md` for usage instructions.
