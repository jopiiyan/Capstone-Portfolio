# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


## Hepta portfolio preview

Run `npm ci` once, then `npm run dev`. The comparison bar offers two styles:

- `/?design=pastel`: a pastel layout with an original illustrated engineering studio.
- `/?design=retro`: a retro layout with warm-paper section tones, saturated animated shapes, and a dark footer. Offscreen animations pause, and reduced-motion preferences are respected.

Both styles use a single page with two navigation anchors. “About Capstone” covers the programme, benefits, timeline, and sponsor requirements. “Why Hepta” starts with the combined tools and stack, followed by expertise and each member’s projects. A sticky white header keeps the Contact us button visible on desktop and mobile.

Both styles present the same company-facing content: the Capstone offer, team expertise, individual project carousels, timeline, sponsor requirements, and contact details. Each of the seven members has an independent carousel with their three projects; images open the full project description. The carousels support buttons, arrow keys, and touch scrolling. Both timelines use five connected step cards, with right-pointing arrows on desktop and down-pointing arrows on mobile. The expertise section pairs three capability areas with sourced member projects, working detail dialogs, and links to the relevant member portfolios. Retro uses blue for CSD, red for ESD, and orange for EPD in its discipline legend, profile badges, and contextual skill tags.

Profiles and project images come from `origin/content/team-details` at `2e85da7`. The supplied outreach deck provides the programme facts, sponsor requirements, timeline, email address, and the corrections to Brian’s and Cliffton’s roles. Slides 4–7, which contain other Capstone teams’ projects and a company-specific pitch, are excluded. Our members’ own projects from slides 11–17 are included.

Implementation lives in `src/demos/`, with the sourced member records in `content.js`. The pastel proposal uses `PastelRefresh.jsx`, `PastelMotion.jsx`, and `pastel-refresh.css`; retro uses `retro-refresh.css` with `RetroPixels.jsx`. The original retro landing composition is retained. Pastel motion uses a subtle breeze, pointer-responsive artwork, and animated tool drawings. The retro footer uses a white SUTD logo. All team photographs preserve their original colours; no photo filters or colour blending are applied. The earlier portfolio remains in `src/App.jsx` but is not part of the active preview. No new runtime dependencies were added. Run `npm run build` to build the static site.


### Pastel illustration

Asset: `public/art/hepta-pastel-studio.png`. Generated with the built-in Image Generation tool, then copied into this project. Team photographs were not part of the generation.

Generation prompt:

> Use case: stylized-concept. Create one original wide 3:2 editorial illustration to use as the lower artwork of a refined pastel website for Hepta, a seven-student SUTD team building hardware and software. No people or faces. Scene: an airy pale celadon and butter-yellow landscape with a small open-air engineering studio built into a terraced garden. Central subject: a beautifully drawn sculptural off-white prototyping workbench, a dark navy laptop with abstract unlabelled blue charts on the left, a sage-green circuit board and sensor module in the middle, and a simple white mechanical test fixture on the right. Subtle brass cables visually connect the components without drawing a loop. Include curved oversized leaves, pale blue sculpted hills, a warm sun and a few white cloud shapes. This should feel like a sophisticated commissioned illustration for a design-conscious technology studio, not a toy robot mascot or a generic clip-art scene. Style: crisp hand-shaped vector-like forms with very subtle editorial grain, soft dimensional shading, beautiful geometric composition, calm pastel colours and dark green small details; no glossy plastic. Composition: wide panoramic visual scene occupies the lower 65 percent with calm empty pale blue-sage sky in upper 35 percent; the workbench is large enough to read at website size, with architectural curves and plants leading in from the sides. Palette light sky #edf4f1, sage #b8d0bb, butter #f4e5ae, pale powder blue #c4d8e5, dark green #234c40, warm white #f8f8ed. Background must be fully opaque and the scene reaches both left and right edges. No words, letters, numbers, logos, watermarks, interface chrome, team photographs or human figures. This is an illustration asset only, not a website screenshot.
