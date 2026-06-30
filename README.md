# Mahmoud Elfeel - Developer Portfolio

This is my personal portfolio built with Next.js App Router, Chakra UI, Framer Motion, and WebGL shaders. It showcases my projects, skills, and experience in a modern, animated, responsive interface.

## Features

- Framer Motion animations and scroll effects
- Chakra UI component styling and theming
- 3D hero banner with WebGL shaders via `@react-three/fiber`
- Modular sections:
  - About Me with typing animation
  - Experience timeline
  - Expandable project cards
  - Visual skill tree
- Smooth scroll-driven `ParallaxBand` backgrounds
- Fully responsive for all screen sizes

## File Structure

```text
app/
├─ layout.tsx             # Global layout with Chakra
├─ page.tsx               # Homepage route
components/
├─ motion/                # Framer motion utilities (e.g. FadeIn)
├─ sections/              # About, Projects, Experience, etc.
├─ three/                 # ShaderPlane.tsx, Banner3D.tsx (3D hero)
├─ ui/                    # Reusable components (Footer, ParallaxBand, etc.)
lib/
├─ motionConfig.ts        # Shared motion easing/timing
public/
├─ bands/                 # Parallax background images
├─ hero.mp4               # Video asset
styles/
├─ globals.css            # Global styles and overrides
```

## Tech Stack

- Next.js App Router
- Chakra UI
- TypeScript
- Framer Motion
- Three.js / `@react-three/fiber`
- GLSL shaders
- Responsive layout

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/mahmoudelfeelig/portfolio.git
   ```

2. Install dependencies:
   ```bash
   cd portfolio
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The site will be live at `http://localhost:3000`.

## Deployment

This project targets Cloudflare Workers through OpenNext, not the deprecated
`@cloudflare/next-on-pages` Pages adapter.

```bash
npm run build:cloudflare
npm run deploy:cloudflare
```

Cloudflare configuration lives in:

- `wrangler.jsonc`
- `open-next.config.ts`
- `next.config.ts`

Do not use `npx @cloudflare/next-on-pages` or `.vercel/output/static` for this
project; that setup is the old Pages build path and will not run the Next API
route correctly.

## Preview

- About: typing animation with highlighted keywords
- Experience: timeline with role, date, and bullet points
- Projects: card grid with expandable details and tech stack
- Skills: interactive skill tree
- Hero: WebGL shader-based animated banner

## Contact

Mahmoud Elfeel  
Email: mahmoudelfeelig@gmail.com  
Website: https://elfeel.me  
GitHub: https://github.com/mahmoudelfeelig

## License

Source code is licensed under the GNU Affero General Public License v3.0 or
later (`AGPL-3.0-or-later`). See [LICENSE](./LICENSE).

Personal assets, screenshots, demo videos, logos, CV/resume files, and other
identity/portfolio media in `public/` are not licensed for reuse without
explicit permission unless a file-specific notice says otherwise.
