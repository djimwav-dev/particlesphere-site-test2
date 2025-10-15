# Development Notes

## Marquee Animation

The header marquee currently uses an 80-second animation cycle. This provides a smooth, leisurely scroll that's easy to read.

### Current Configuration
\`\`\`css
.animate-marquee {
  animation: marquee 80s linear infinite;
  will-change: transform;
}
\`\`\`

### Alternative Speeds
If you want to adjust the marquee speed, here are recommended durations:

- **Slower** (100s+): More readable, very relaxed pace
- **Current** (80s): Balanced, smooth scrolling
- **Faster** (40-60s): More dynamic, harder to read individual words
- **Very Fast** (<40s): Eye-catching but difficult to read

### Customization
To change the speed, edit `app/globals.css`:

\`\`\`css
/* Option 1: CSS variable (recommended) */
:root {
  --marquee-duration: 80s;
}

.animate-marquee {
  animation: marquee var(--marquee-duration) linear infinite;
}

/* Option 2: Direct value */
.animate-marquee {
  animation: marquee 60s linear infinite;  /* Change 60s to desired duration */
}
\`\`\`

## Performance Optimizations Applied

### 3D Sphere
- Device pixel ratio capped at 1.5 to reduce GPU load
- Frame loop set to "demand" mode (only renders when needed)
- Client-side only rendering (no SSR)
- Proper texture disposal to prevent memory leaks

### Animations
- CSS transforms used for GPU acceleration
- `will-change` property for smooth scrolling
- Pause on hover to reduce CPU usage

### Images
- All images unoptimized for static export compatibility
- Consider using external CDN (Cloudinary, Imgix) for production
- Proper alt attributes for accessibility

## Known Issues & Workarounds

### Issue: fs Module in Browser
**Problem**: Node.js `fs` module doesn't work in browser-based Next.js runtime.

**Solution**: Import JSON files directly instead of reading from filesystem:
\`\`\`tsx
// ❌ Don't do this
import fs from 'fs'
const data = JSON.parse(fs.readFileSync('data.json'))

// ✅ Do this instead
import data from '@/data/data.json'
\`\`\`

### Issue: MDX in Static Export
**Problem**: MDX files can't be easily imported in static export mode.

**Solution**: Convert MDX content to JSON format with content as string:
\`\`\`json
{
  "title": "Post Title",
  "content": "Markdown content as string..."
}
\`\`\`

### Issue: Dynamic Routes
**Problem**: Dynamic routes need static params for export.

**Solution**: Always implement `generateStaticParams`:
\`\`\`tsx
export async function generateStaticParams() {
  return items.map(item => ({ slug: item.slug }))
}
\`\`\`

## Future Improvements

### Content Management
- [ ] Add more example content files
- [ ] Implement content validation
- [ ] Add content preview mode
- [ ] Create content templates

### Performance
- [ ] Implement image CDN
- [ ] Add service worker for offline support
- [ ] Optimize bundle size
- [ ] Add loading skeletons

### Features
- [ ] Search functionality
- [ ] Pagination for large collections
- [ ] Social media integration
- [ ] Newsletter signup
- [ ] Analytics integration

### Accessibility
- [ ] Add skip navigation links
- [ ] Improve keyboard navigation
- [ ] Add screen reader announcements
- [ ] Test with accessibility tools

### SEO
- [ ] Add meta tags
- [ ] Generate sitemap
- [ ] Add robots.txt
- [ ] Implement structured data

## Development Tips

### Adding New Pages
1. Create page in `app/` directory
2. Add navigation link in `site-header.tsx`
3. Update `docs/SUMMARY.md`
4. Test static export

### Adding New Content Types
1. Create data structure in `data/` or `content/`
2. Add TypeScript interface
3. Create card component
4. Add to CMS config
5. Create detail page with `generateStaticParams`

### Debugging 3D Issues
1. Check browser console for WebGL errors
2. Verify image paths in `sphere.json`
3. Test with `dpr={[1, 1]}` for performance
4. Use React DevTools to inspect component state

### Testing Static Export
\`\`\`bash
pnpm build
cd out
python3 -m http.server 8000
# Open http://localhost:8000
\`\`\`

## Code Style Guidelines

### File Naming
- Components: `kebab-case.tsx`
- Pages: `page.tsx` (App Router convention)
- Data: `kebab-case.json`

### Component Structure
\`\`\`tsx
// 1. Imports
import { useState } from 'react'

// 2. Types
interface Props {
  title: string
}

// 3. Component
export function Component({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState()
  
  // 5. Handlers
  const handleClick = () => {}
  
  // 6. Render
  return <div>{title}</div>
}
\`\`\`

### CSS Classes
- Use Tailwind utility classes
- Group by category (layout, spacing, colors, typography)
- Use `cn()` utility for conditional classes

## Maintenance Checklist

### Weekly
- [ ] Check for dependency updates
- [ ] Review CMS content
- [ ] Test all pages
- [ ] Check analytics

### Monthly
- [ ] Update dependencies
- [ ] Review performance metrics
- [ ] Backup content
- [ ] Test on multiple devices

### Quarterly
- [ ] Security audit
- [ ] Accessibility audit
- [ ] SEO review
- [ ] Content strategy review
