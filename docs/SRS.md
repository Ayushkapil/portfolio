# Software Requirements Specification
## Personal Portfolio Website

**Project:** Personal Portfolio Website
**Owner:** Ayush Kapileshwar
**Date:** April 2026
**Version:** 2.0

---

## Table of Contents
1. Project Overview
2. Goals & Scope
3. Design System
4. Site Architecture & Content Specification
5. Orbit Simulation — Technical Specification
6. Animations & Interactions
7. Tech Stack
8. Folder Structure
9. Responsive Behaviour
10. Performance Requirements
11. Deployment
12. Build Notes & Constraints
13. Deliverables Checklist

---

## 1. Project Overview

This is a personal portfolio website for Ayush Kapileshwar. The purpose of the site is to present who he is — as a data science student, tabla practitioner, and photographer — in a way that reflects his voice, thinking style, and aesthetic sensibility.

The site is not a résumé or a CV. It is a personal presence on the web. The writing, structure, and design should feel considered, calm, and distinctly personal.

Design inspiration: Apple's product website — specifically its use of large typography, full-bleed imagery, generous whitespace, scroll-driven content reveals, and the principle of one idea per screen.

---

## 2. Goals & Scope

### Goals
- Present Ayush's three dimensions: Data & Patterns, Rhythm & Constraints (Tabla), Looking at Things (Photography)
- Reflect his voice — observational, honest, non-corporate
- Be visually distinctive without being loud
- Be fully functional on desktop and mobile
- Include an interactive orbit simulation on the landing page
- Support dark mode and light mode

### In Scope
- Single-page website with scroll-based navigation
- 7 sections (detailed in Section 4)
- Dark/Light mode toggle
- Orbit canvas simulation (landing page only)
- Scroll-triggered animations
- Notes/writing section with individual reading views
- Fully responsive layout

### Out of Scope
- CMS or backend of any kind
- Contact form (links only)
- Analytics (can be added later)
- Blog pagination (Notes section is static for now)

---

## 3. Design System

### 3.1 Color Palette

#### Light Mode
| Role | Token | Hex |
|------|-------|-----|
| Background | --color-bg | #F5F2EB |
| Primary text | --color-text | #2C2C2C |
| Primary accent | --color-purple | #7C3AED |
| Secondary accent | --color-orange | #F97316 |
| Subtle border | --color-border | #DDD8D0 |

#### Dark Mode
| Role | Token | Hex |
|------|-------|-----|
| Background | --color-bg | #1F1F1F |
| Primary text | --color-text | #F5F5F5 |
| Primary accent | --color-purple | #8B5CF6 |
| Secondary accent | --color-yellow | #FACC15 |
| Subtle border | --color-border | #2E2E2E |

#### Usage Rule — Non-Negotiable
- 80% of every screen is neutral (background + text colors only)
- 15% purple — section numbers, tags, hover borders, active states
- 5% orange (light) / yellow (dark) — the arrow in Notes section, one or two deliberate highlights only
- Overusing accent colors defeats the entire design. If in doubt, use neutral.

### 3.2 Typography

#### Typefaces
| Role | Font | Source |
|------|------|--------|
| Display / Headings | Cormorant Garamond | Google Fonts |
| Body | DM Sans | Google Fonts |
| Quotes / Captions | Lora (italic) | Google Fonts |
| Code / tags | DM Mono | Google Fonts |
| 8-bit widget | Press Start 2P | Google Fonts |

#### Scale
| Element | Font | Size (desktop) | Size (mobile) | Weight |
|---------|------|----------------|---------------|--------|
| Name (landing) | Cormorant Garamond | 72px | 48px | 300 |
| Section heading | Cormorant Garamond | 48px | 32px | 400 |
| Pillar title | Cormorant Garamond | 40px | 28px | 400 |
| Body paragraph | DM Sans | 18px | 16px | 400 |
| Caption | Lora italic | 14px | 13px | 400 |
| Tags / labels | DM Mono | 12px | 12px | 400 |
| Section number | DM Mono | 13px | 12px | 400 |

#### Line Height
- Body: 1.8
- Headings: 1.2
- Captions: 1.6

#### Max Width
- All text content: 720px max-width, centered or left-aligned within the content column
- Reading view (Notes): 680px max-width, centered

### 3.3 Spacing

Use an 8-point grid throughout. All padding, margin, and gap values should be multiples of 8px.

| Token | Value |
|-------|-------|
| --space-xs | 8px |
| --space-sm | 16px |
| --space-md | 32px |
| --space-lg | 64px |
| --space-xl | 128px |

Section vertical padding: --space-xl top and bottom on desktop, --space-lg on mobile.

### 3.4 Dark / Light Mode Toggle

- Toggle button: top-right corner, always visible, fixed position
- Icon: sun (☀) for light mode, moon (☾) for dark mode
- On toggle: `transition: background-color 0.4s ease, color 0.4s ease` — smooth, not instant
- Preference saved to localStorage so it persists on revisit
- Default: detect system preference using prefers-color-scheme, then respect user override
- Implementation via class on `<html>` element: `<html class="dark">` or `<html class="light">`
- All color tokens defined as CSS custom properties under both classes

---

## 4. Site Architecture & Content Specification

The site is a single HTML file with all sections stacked vertically. Navigation is scroll-based. A sticky minimal nav appears after the user scrolls past the landing section.

### Section Order
0. Landing
1. About
2. Three Pillars
3. Things I've Seen (Photography)
4. Notes
5. Projects
6. Contact

---

### Section 0 — Landing

**Purpose:** First impression. Sets the tone entirely.

**Layout:**
- Full viewport height (100vh)
- Orbit canvas fills the entire viewport at z-index: 0
- Text content sits at z-index: 1, centered vertically and horizontally
- Dark/light toggle fixed at top-right
- Subtle scroll indicator (↓) at bottom-center — clickable, scrolls to #about section with smooth scroll
- 8-bit minimal clock widget fixed at top-right (left of theme toggle)
- 🎮 game mode button (landing only) below theme toggle

**Content:**
```
Ayush Kapileshwar

Trying to become a better student every day.
Devoted to Indian classical music.
I code sometimes; but more often, I love to capture moments that tell stories.

↓ (interactive — scrolls to #about on click)
```

**Animation:**
- Name appears immediately on load, fade-in 0.6s
- Taglines fade in after 0.8s delay
- Scroll indicator fades in after 1.4s delay
- Scroll indicator: bounceDown animation (2s ease-in-out, infinite, starts at 2.4s)
- Orbit simulation begins immediately in background

**On scroll:**
- Canvas opacity transitions from 1 to 0 over the first 200px of scroll
- Handled via scroll event listener updating canvas opacity

**Sticky nav behaviour:**
- Nav is hidden on landing
- After scrolling past 100vh, a minimal nav fades in at the top
- Nav contains: name (left) + section links (right) + toggle
- Nav background: rgba(--color-bg, 0.85) with backdrop-filter: blur(12px)
- Nav links: About Me · Pillars · Seen · Notes · Work · Contact

---

### Section 1 — About Me

**Purpose:** Who Ayush is, how he thinks. Narrative only. No lists, no bullet points.

**Layout:**
- Single-column, text only, max-width 720px, centered
- No photo

**Content (USE EXACTLY):**

"I'm a first-year MS in Data Science student at Indiana University Bloomington. Most of my time right now goes into building things with AI and figuring out what I actually think about it.

I've been learning tabla for about nine years — four of those with formal training, the rest just practice and a lot of listening. I don't have my tabla with me right now, so I play rhythms on my balcony railing, which sounds ridiculous but is actually how I get through most days. Tabla taught me something I keep coming back to: you express yourself better inside constraints. Give me a fixed cycle, a specific taal, and I can find something to say inside it. Give me infinite space and it turns into noise.

I also take photographs — street stuff mostly. Flowers, light, reflections. I've done a couple of wildlife trips, including Masai Mara and Tanzania, and those mattered to me, but I'm not a wildlife photographer. I just like looking at things carefully.

Recently I helped build an app that uses AI to generate music journeys based on emotion and biometrics. I didn't plan that as some grand intersection of my interests — it just turned out the thing I wanted to build sat exactly where music and data overlap. That keeps happening.

I also cook. That's not a pillar. It's just true.

I tend to approach most things slowly."

**Animation:** Section fades and slides up into view on scroll (translateY(30px) → translateY(0))

---

### Section 2 — Three Pillars

**Purpose:** What Ayush does, across three domains.

**Layout:**
- Three consecutive full-viewport-height blocks, stacked vertically
- Each block: left-aligned content, vertically centered, generous padding
- No cards, no grid — each pillar is its own screen moment

**Content:**

**Pillar 01 — Data & Patterns**
```
01
Data & Patterns
───────────────────────────────────
"Most of my models don't work. The interesting part is figuring out why."

ML  ·  Mathematics  ·  Data Science
```

**Pillar 02 — Rhythm & Constraints**
```
02
Rhythm & Constraints
───────────────────────────────────
"When a rhythm clicks, I don't want it to stop. That's how I know it worked."

Tabla  ·  Taal  ·  Listening
```

**Pillar 03 — Looking at Things**
```
03
Looking at Things
───────────────────────────────────
"I photograph things that remind me of a time I can't quite place. Mostly I just stop for the light."

Photography  ·  Streets  ·  Light
```

**Animation per pillar (scroll-triggered):**
- Section number (01) fades in first
- Title fades and slides up 0.3s after
- Divider line expands from left 0.3s after that
- Quote fades in 0.3s after
- Tags fade in last

The number 01 / 02 / 03 is the only purple element on each screen. Small, DM Mono, 13px.
Tags: Plain text, DM Mono, letter-spaced, no pills, no borders.

---

### Section 3 — Things I've Seen (Photography)

**Purpose:** Visual breathing room. Show photography with weight and space.

**Layout — alternating rhythm:**
1. Full-bleed image (100% viewport width)
2. Two-column image pair (50% / 50%)
3. Full-bleed image (100% viewport width)
4. Optional: one final standalone image at 70% width, centered

Total images: 4–6. Placeholder images for now.

**Image treatment:**
- No borders, no frames, no drop shadows, no rounded corners
- Full-bleed images: object-fit: cover, fixed height 85vh
- Pair images: object-fit: cover, fixed height 60vh

**Captions:**
- Position: below image, left-aligned
- Font: Lora italic, 14px, --color-text at 70% opacity
- Style: impression, not description
- Placeholder captions:
  - "The light lasted about four seconds."
  - "I almost walked past this."
  - "He had been there longer than I had."
  - "Bloomington, on a morning I nearly stayed in."

**Animation:** Images fade in as they enter viewport. No parallax.

**Section title:** "Things I've Seen" — left-aligned, above the first image, standard section heading treatment.

---

### Section 4 — Notes

**Purpose:** Ayush's writing. Short reflections. This is what makes the portfolio feel alive over time.

**Layout:**
- Clean list, full width within content column
- Each entry: date + title + arrow only
- No preview text, no thumbnails

**Content:**
```
Apr 2026
Why constraints make you more creative, not less               →
─────────────────────────────────────────────────────────────────

Mar 2026
What I actually do when I don't have my tabla                  →
─────────────────────────────────────────────────────────────────

Mar 2026
Building an AI music therapist in 36 hours                     →
─────────────────────────────────────────────────────────────────
```

**Styling:**
- Date: DM Mono, 12px, --color-text at 50% opacity, above the title
- Title: DM Sans, 18px, full opacity
- Arrow →: --color-orange (light) / --color-yellow (dark) — this is the 5% accent color
- Divider: 1px solid --color-border
- On hover: title slides 4px to the right, transition: 0.2s ease

**Reading View:**
- Clicking an entry opens a separate minimal reading page
- Reading view: white/dark-grey background, 680px max-width, centered
- Font: Lora, 20px, line-height: 1.9
- Back link: top-left, small, ← Notes
- No other UI elements in reading view
- Separate HTML files: /notes/constraints.html, /notes/tabla.html, /notes/moodflow.html
- Each note reading view should have placeholder body text for now (a couple of paragraphs indicating the essay topic)

---

### Section 5 — Projects

**Purpose:** Show work, with honesty about what was learned.

**Layout:**
- Full-width cards, stacked vertically, with --space-md gap between them
- Each card: left-aligned, full-width, subtle bottom border

**Content (USE EXACTLY):**

**Card 1 — MoodFlow**
```
MoodFlow                                                    [ hackathon ]
─────────────────────────────────────────────────────────────────────────
An iOS app that builds AI-generated music journeys based on how you're
feeling — emotionally and physiologically — and plays them live
through Spotify. You pick your mood, enter biometrics, choose where
you want to end up, and the AI builds a four-stage path to get you
there. Built at an AI hackathon at IU Bloomington, team of four.

What I did
──────────────────────────────────────────────────────────────────────
Designed and iterated on the LLM prompts — the music therapist
persona, the four-stage journey structure, the mood-to-music
mapping logic, and the adaptive re-curation prompts that regenerate
remaining stages when a user says the music isn't working.

What I learned
──────────────────────────────────────────────────────────────────────
The LLM kept recommending the same songs. Every journey, no matter
the mood, same handful of tracks. Getting an AI to be genuinely
diverse in its recommendations — not just correct, but surprising —
turned out to be the hardest prompt engineering problem we hit.

SwiftUI · Groq / Llama 3.3 · Spotify SDK · Prompt Engineering · Team of 4
```

**Card 2 — AeroOps Copilot**
```
AeroOps Copilot                                        [ in progress ]
─────────────────────────────────────────────────────────────────────────
A modular AI system for aviation safety. Three modules — SOP
retrieval via RAG with cross-encoder reranking, structured incident
analysis from PDF reports, and fatigue risk scoring from pilot
schedules — connected through an LLM-based intent router that
chains them automatically.

What I did
──────────────────────────────────────────────────────────────────────
Designed the full system: three-module architecture, cross-module
chaining logic, evaluation framework with three research questions,
and the data pipeline design from FAA and NASA source documents.
Currently building the implementation.

What I learned
──────────────────────────────────────────────────────────────────────
I wanted to be a pilot growing up. Didn't happen, but the interest
in aviation never went away. Building something for the people who
are actually in that world — even as a student project — feels like
the right use of what I'm learning. The system isn't built yet. But
the design forced me to think about how modules should talk to each
other, and I learned that architecture decisions made on paper feel
very different once you start writing the first line of code.

Python · FastAPI · LangChain · pgvector · React · In Progress
```

**Styling:**
- Tag: small, purple, DM Mono, top-right of card
- On hover: 3px left border appears in --color-purple
- Cards slide upward into view on scroll (translateY(40px) → translateY(0))
- Transition: 0.5s ease

---

### Section 6 — Contact

**Purpose:** Warm, minimal exit point.

**Layout:**
- Full viewport height, content centered vertically and horizontally
- Nothing else on this screen

**Content:**
```
"If something here resonated,
 I'd like to hear from you."


ayushkapileshwar@gmail.com
LinkedIn  ·  GitHub
```

**Styling:**
- Quote: Cormorant Garamond, 40px (desktop) / 28px (mobile), centered, italic
- Links: plain text, DM Sans, no underline by default, underline on hover
- Links are --color-text, not purple — keep it neutral
- Spacing between quote and links: --space-lg

**Footer (inside this section, bottom):**
```
─────────────────────────────────────────────
Ayush Kapileshwar                        2026
```
Footer text: DM Mono, 12px, --color-text at 40% opacity. Nothing else in the footer.

---

## 5. Orbit Simulation — Technical Specification

Full-viewport HTML5 Canvas animation on the landing page only.

### 5.1 Canvas Setup
```html
<canvas id="orbit-canvas"></canvas>
```
```css
#orbit-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: auto;
}
```
On scroll past landing section: opacity transitions to 0, pointer-events set to none.

### 5.2 Physics Model
Gravitational acceleration applied to each body each frame:
```
dx = blackhole.x - body.x
dy = blackhole.y - body.y
distance = sqrt(dx² + dy²)
force = G / (distance²)
ax += force × (dx / distance)
ay += force × (dy / distance)
body.vx += ax
body.vy += ay
body.x += body.vx
body.y += body.vy
```
Apply for each black hole independently, summing accelerations.

**Tuning constants:**
| Constant | Starting value |
|----------|---------------|
| G | 5000 |
| MAX_VELOCITY | 12 |
| TRAIL_LENGTH (background) | 80 frames |
| TRAIL_LENGTH (game mode) | 200 frames |
| BODY_RADIUS (background) | 4px |
| BODY_RADIUS (game mode) | 3px |
| BLACKHOLE_RADIUS | 8px |
| Trail opacity multiplier | 0.9 |
| MAX_BODIES (background) | 14 |
| MAX_BODIES (game mode) | 100 |

Velocity cap: clamp vx and vy to ±MAX_VELOCITY each frame.
Removal: body within 10px of black hole = absorbed. Body exits canvas by 200px = escaped.

### 5.3 Black Hole Placement
Two black holes, positioned proportionally:
```
blackhole_1: { x: canvas.width × 0.38, y: canvas.height × 0.45 }
blackhole_2: { x: canvas.width × 0.65, y: canvas.height × 0.52 }
```
Rendered as filled circles, --color-text color, radius 8px, with subtle glow: `shadow: 0 0 12px rgba(color, 0.6)`

### 5.4 Body Colors
```javascript
const COLORS = {
  dark:  ['#8B5CF6', '#FACC15', '#F5F5F5'],
  light: ['#7C3AED', '#F97316', '#111111']
}
```

### 5.5 Trail Rendering
Each body stores last TRAIL_LENGTH positions. Draw as line segments with opacity gradient (oldest = transparent, newest = opaque). Canvas partially cleared each frame:
```javascript
ctx.fillStyle = 'rgba(background-color, 0.15)'
ctx.fillRect(0, 0, canvas.width, canvas.height)
```

### 5.6 Auto-Launch
On init, launch 4 bodies with pre-set positions and velocities:
```javascript
const AUTO_LAUNCHES = [
  { x: 0.2,  y: 0.3,  vx: 2.5,  vy: 1.5  },
  { x: 0.8,  y: 0.6,  vx: -2.0, vy: -1.8 },
  { x: 0.5,  y: 0.1,  vx: 1.0,  vy: 3.0  },
  { x: 0.15, y: 0.7,  vx: 3.0,  vy: -1.0 },
]
```

### 5.7 Click to Launch
On click: spawn body at click position, aimed toward nearest black hole with 0.6 radian offset (creates orbital arc, not collision). Maximum 14 bodies at once (game mode cap).

### 5.8 Game Mode
🎮 button appears on landing page (fades with canvas on scroll). Clicking the 🎮 button opens a **full-screen overlay** that covers the entire page:
- **Full-screen canvas** (`#game-canvas`) fills the overlay; separate from the background simulation
- **No auto-launch** — canvas starts empty; user taps/clicks anywhere to create planets
- **Unlimited planets** (up to 100) in freely chosen colors from the expanded 14-color palette
- **Persistent trails** — background clear alpha drops to 0.03 so colored traces build into art
- **HUD bar** at the bottom of the overlay:
  - Left: BLACK HOLES counter (1–4) with − and + buttons
  - Center: "tap anywhere to launch planets" hint
  - Right: PLANETS count, CLEAR button (wipes all bodies and trail art), EXIT button
- **Black hole arrangements** (same as background mode): 1 = center, 2 = default, 3 = triangle, 4 = square
- **Expanded color palette** (14 colors): `#8B5CF6`, `#FACC15`, `#F97316`, `#EC4899`, `#14B8A6`, `#3B82F6`, `#EF4444`, `#10B981`, `#F59E0B`, `#6366F1`, `#84CC16`, `#F472B6`, `#22D3EE`, `#A855F7`
- Colors cycle so each new planet gets a different color
- EXIT closes overlay and stops game animation loop; CLEAR wipes the canvas art

**Game mode is desktop-only.** Hidden on screens < 768px.

### 5.8 Resize Handling
Reposition black holes on resize. Clear in-flight bodies — acceptable.

### 5.9 Mobile
Use touchstart for launch. Reduce trail length to 50. If < 768px width: disable canvas, use static subtle gradient background instead.

### 5.10 Dark/Light Mode
Update palette on toggle. Existing bodies keep color, new bodies use updated palette.

### 5.11 Clock Widget

A minimal fixed widget sits to the left of the theme toggle at `top: 18px; right: 76px; z-index: 200`.

**Clock:**
- Format: `HH:MM:SS`, updates every second
- Font: Press Start 2P, 7px
- The widget is intentionally subtle — opacity 0.7, no solid background, no border
- On hover: opacity increases to 1

**Styling:**
- Light mode: `rgba(44, 44, 44, 0.08)` background (almost transparent), `--color-text` color, no border
- Dark mode: `rgba(245, 245, 245, 0.08)` background (almost transparent), `--color-text` color, no border
- Padding: 3px 8px; border-radius: 3px

**No temperature, no geolocation.** Clock only.

---

## 6. Animations & Interactions

### 6.1 Scroll-Triggered Reveals
Use IntersectionObserver, threshold 0.15. Add class .visible:
```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```
Staggered delays for pillar content: 0s, 0.15s, 0.3s, 0.45s, 0.6s

### 6.2 Sticky Navigation
- Hidden on load
- Appears after scrolling past 100vh
- position: fixed, top: 0, z-index: 100
- Background: var(--color-bg) at 85% opacity + backdrop-filter: blur(12px)
- Contents: Ayush Kapileshwar (left) | About Me · Pillars · Seen · Notes · Work · Contact (right) | toggle (far right)
- Active section highlighted in purple via scroll position
- Smooth scroll to sections

### 6.3 Project Card Hover
3px left border in --color-purple on hover.

### 6.4 Notes Hover
Title slides 4px right on hover, 0.2s ease.

### 6.5 General
All interactive elements: cursor: pointer. No custom cursor. No aggressive hover effects.

---

## 7. Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 with custom properties |
| Interactivity | Vanilla JavaScript (ES6+) |
| Animation | CSS transitions + IntersectionObserver |
| Canvas | HTML5 Canvas API |
| Fonts | Google Fonts |
| Deployment | Vercel |

No frameworks. No build tools. No npm. Fully static.

---

## 8. Folder Structure

```
portfolio/
├── index.html
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   └── canvas.css
├── js/
│   ├── orbit.js
│   ├── theme.js
│   ├── nav.js
│   ├── scroll-animations.js
│   ├── main.js
│   └── clock.js
├── notes/
│   ├── constraints.html
│   ├── tabla.html
│   └── moodflow.html
├── assets/
│   └── images/
│       ├── wildlife-01.jpg (placeholder)
│       ├── wildlife-02.jpg (placeholder)
│       ├── wildlife-03.jpg (placeholder)
│       └── wildlife-04.jpg (placeholder)
└── docs/
    └── SRS.md
```

---

## 9. Responsive Behaviour

| Breakpoint | Width | Behaviour |
|-----------|-------|-----------|
| Desktop | ≥ 1024px | Full layout as designed |
| Tablet | 768px – 1023px | About: full width. Pillars: full width. Photo pairs: stack |
| Mobile | < 768px | Single column. Nav: name + toggle only. Font sizes reduced. Canvas disabled. |

Mobile-specific:
- Sticky nav: name + toggle only, no section links
- Photography full-bleed: 60vh (not 85vh)
- Orbit canvas: disabled, replaced with subtle gradient

---

## 10. Performance Requirements

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Page weight (excl. images) | < 200KB |
| Images | Compressed, max 300KB per full-bleed |
| Canvas frame rate | 60fps desktop, 30fps mobile |
| No render-blocking resources | CSS in head, JS deferred |

All fonts: font-display: swap, preload Cormorant Garamond and DM Sans.

---

## 11. Deployment

Platform: Vercel
- Push to GitHub → connect to Vercel → no build config needed
- Fully static, no env vars, no server

---

## 12. Build Notes & Constraints

Non-negotiable decisions:
1. No bullet points anywhere on the site. All content is prose or spaced plain text.
2. No icons except dark/light toggle. No Font Awesome, no icon packs.
3. No image borders, frames, or drop shadows. Images are raw.
4. No looping animations on visible content — only canvas loops. Exception: scroll indicator bouncing animation (subtle, only on landing).
5. The Notes arrow → must be orange (light) / yellow (dark). Only instance of 5% accent.
6. Purple only for: section numbers, project tags, hover border, active nav link.
7. Orbit canvas fades invisible on scroll. Not visible on any other section.
8. Reading view: zero chrome. No sidebar, no related posts. Back link only.
9. Footer: name and year only.
10. All fonts loaded before first paint via font-display: swap and preload.

---

## 13. Deliverables Checklist

### Structure
- [ ] All 7 sections present and correctly ordered
- [ ] Single index.html with correct section IDs
- [ ] CSS split into correct files
- [ ] JS files present and loading without errors

### Design
- [ ] Color tokens as CSS custom properties
- [ ] Light mode correct
- [ ] Dark mode correct
- [ ] Toggle smooth and persists
- [ ] All four fonts loading
- [ ] Typography scale matches spec

### Sections
- [ ] Landing: full viewport, canvas behind, animation timing
- [ ] About: single-column, no photo, no bullet points
- [ ] Pillars: three full-viewport sections, staggered animation, purple number only
- [ ] Things I've Seen: alternating layout, no image borders, italic captions
- [ ] Notes: date + title + arrow, orange/yellow arrow, hover slide
- [ ] Notes reading view: minimal, 680px, back link only
- [ ] Projects: full-width cards, hover border, correct content
- [ ] Contact: centered quote, plain text links, minimal footer

### Orbit Canvas
- [ ] Fills landing viewport
- [ ] Two black holes proportional
- [ ] Auto-launch on load
- [ ] Click/touch to launch
- [ ] Trail fading works
- [ ] Bodies removed on absorption/escape
- [ ] Fades on scroll
- [ ] Colors update with toggle
- [ ] Resize handling

### Interactions
- [ ] Sticky nav after landing
- [ ] Smooth scroll from nav
- [ ] Active section in nav
- [ ] All scroll reveals via IntersectionObserver
- [ ] Project card hover
- [ ] Notes title hover shift

### Responsive
- [ ] Desktop ≥1024px correct
- [ ] Tablet 768–1023px correct
- [ ] Mobile <768px correct
- [ ] Mobile nav simplified
- [ ] Canvas disabled on mobile

### Performance
- [ ] No render-blocking scripts
- [ ] Fonts preloaded
- [ ] No console errors
