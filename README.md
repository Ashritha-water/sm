# Sri Mithra Enterprises website

Corporate website with interactive 3D scenes, built with Next.js 16, React 19, TypeScript, Tailwind CSS 4,
Three.js / React Three Fiber / Drei, GSAP ScrollTrigger and Framer Motion.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to the out/ folder (for Amazon S3)
```

The site is a static export (`output: "export"` in `next.config.ts`): there is no Node.js server, API route or
server-side code. See **DEPLOY-S3.md** for uploading `out/` to S3 with CloudFront.

## Before going live

1. **Company details**: edit `src/lib/site.ts` (email, phone, registered address, social profiles).
   Empty fields are hidden on the site, so nothing appears until you add real details.
2. **Build settings** in `.env.production`:
   - `NEXT_PUBLIC_SITE_URL=https://shrimithra.in` (canonical links, sitemap, robots and link previews).
   - `NEXT_PUBLIC_CONTACT_ENDPOINT`: your Formspree form URL. The form posts directly from the browser.
     Until it is set, the form shows a "being set up" message.
3. **Content**: service copy lives in `src/lib/services.ts`, process steps in `src/lib/process.ts`.

## Structure

| Path | What it is |
|---|---|
| `src/app` | Routes: home, `services/[slug]` detail pages, sitemap, robots, 404 |
| `src/components/sections` | Page sections (content and layout) |
| `src/components/three` | Reusable 3D scenes and helpers, kept separate from content |
| `src/components/scenes` | Thin wrappers that put a scene inside the shared canvas |
| `src/components/three/SceneCanvas.tsx` | Shared canvas: lazy mount near viewport, pause off-screen, adaptive pixel ratio, WebGL fallback |
| `src/lib` | Site config, services, process steps, contact validation, scroll state |
| `scripts/flatten-segments.mjs` | Post-build step that adds the prefetch files static hosts need |

## Performance and accessibility

- 3D code for each section downloads only when a visitor scrolls near it; scenes stop rendering when off-screen
  and unmount when far away.
- Particle counts and pixel ratio scale down on phones, tablets and low-core devices; quality drops automatically if
  the frame rate falls.
- `prefers-reduced-motion` renders scenes as still frames and disables decorative animation.
- Semantic landmarks, skip link, keyboard-accessible navigation and menu, labelled form fields with inline errors.

## Trademarks

Meta and WhatsApp are trademarks of Meta Platforms, Inc. The site states the Meta Tech Provider status without
using Meta or WhatsApp logos and includes a non-endorsement notice.
