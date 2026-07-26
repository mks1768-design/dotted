# Handoff: Dotted — Note-Taking App

## Overview
"dotted" is a mobile note-taking app centered on a single recurring mark — a black dot — that recurs everywhere (splash logo, header mark, and as an illustrated character in each of the 4 home icons). Core loop: write a note → optionally have AI improve/rewrite it → optionally scan a book page (extract + explain text) → store it in a notes library. Each note carries a "kind" (Write / Improve / Scan) and can have a custom paper color or a full-bleed photo background.

## About the Design Files
The bundled HTML file (`dotted.dc.html`, plus its two dependency files) is a **design reference built with an internal prototyping tool** — not production code. Do not copy the HTML/JS verbatim into the app. Recreate the screens, layout, states, and interactions described below using **your project's actual stack** (React Native, SwiftUI, Flutter, etc.) and its existing component/design-token system. If no codebase exists yet, choose the framework best suited to a real iOS/Android note app and implement fresh.

## Fidelity
**High-fidelity.** Colors, type, spacing, and icon shapes shown are final intent — reproduce them closely. The specific SVG icon paths are reference illustrations (a jumping dot at a bookshelf, a dot holding a magnifying glass, a dot as a pencil's period, a dot with sparkles) — redraw them natively/as vector assets rather than embedding raw inline SVG, but keep the same visual concept (the dot as a small recurring character, not just a plain circle).

## Design system this pulls from
Classical: a light, editorial system — `#f3f2f2` background, near-black `#201f1d` text, single gold/bronze accent `#b68235` used only as strokes/small marks (never solid fills), Cormorant Garamond headings over Lora body, hairline dividers, outlined (not filled) buttons, bordered unfilled cards, photos "matted" in a plate frame. See full token list below.

## Customization goals (design this to be easy to re-skin)
When implementing, structure the app so these are single-source-of-truth config values, not hardcoded per-screen — this is the most important part of the handoff:
1. **Home menu items** — an array of `{ id, label, screen, icon }` driving the 4-row home list. Adding/removing/reordering a row should require editing only this array.
2. **Colors/tokens** — pull all colors from a central theme file (background, text, accent, divider, neutral ramp) so re-theming the whole app is a token swap, not per-component edits.
3. **Note "kind" set** — Write / Improve / Scan is an enum with a label + icon + target screen each; adding a 4th kind (e.g. "Record") should be additive, not a rewrite.
4. **Note paper styles** — the 4 flat paper colors + 1 photo-background mode should be a swatch config array, not hardcoded divs.
5. **Icon illustrations** — each home-row icon and each screen's hero illustration should be its own named component/asset so an icon can be swapped without touching layout code.

## Screens / Views

### 1. Splash
- **Purpose**: Brief app-open branding moment, auto-advances to Home after ~1.6s (tappable to skip).
- **Layout**: Full-screen, centered column, `gap: 18px`.
- **Components**:
  - Dot mark: 88×88px circle, `background: #201f1d` (color-text), soft shadow. Animates in: drops from above with an overshoot bounce (~1.1s, cubic-bezier(.32,1.6,.5,1)), settling in place.
  - Wordmark "dotted": Cormorant Garamond, semibold, 34px, color-text, fades/slides up in starting at 0.9s.
- **Interaction**: Tap anywhere skips to Home immediately.

### 2. Home
- **Purpose**: Primary navigation — pick one of 4 actions.
- **Layout**: Full height column. Header (54px top padding): small 26px dot + "dotted" wordmark on the left, a pill tag showing "`{notesCount}` saved" on the right. Below: 4 equal-height rows stacked vertically (NOT a grid of 4 squares — full width rows), separated by 1px hairlines.
- **Row content** (each row: icon+label left-aligned via `gap:16px`, chevron right-aligned via `justify-content: space-between`):
  1. **STORE** → opens Notes List. Icon: a dot jumping above a small bookshelf (4 book spines + baseline).
  2. **EXPLANATION** → opens Scan screen (kind=scan). Icon: a dot as the handle-end of a magnifying glass.
  3. **WRITE** → opens Editor (kind=write). Icon: a dot as the pencil tip / period at the end of a curved pen stroke.
  4. **IMPROVE** → opens AI screen (kind=improve). Icon: a dot with 3 small gold sparkles around it.
- **Interaction states**: hover tints the row `accent-100`; press scales to 0.98.
- **Icons are drawn in accent-700/text; sparkles use the gold accent.**

### 3. Notes List ("Store")
- **Purpose**: Browse/select saved notes.
- **Layout**: Header with back-chevron + small dot mark + "dotted" title, hairline rule below. Scrollable list of note cards, `gap:12px`, padding `16px 20px 90px`. Floating "+" button bottom-right (56px circle, color-text bg) to create a new note.
- **Card** (`.card` component): kicker row with date (left) + a `kind` tag (Write/Improve/Scan, right, outlined style), then title (heading font) and a 1-line snippet (body font, truncated).
- **Empty state**: when no notes exist, show a bookshelf-with-jumping-dot illustration + "No notes yet — tap + to write your first one."
- **Interaction**: tapping a card opens that note on the screen matching its `kind` (write→Editor, improve→AI, scan→Camera), fully populated with its saved title/body/color.

### 4. Editor ("Write")
- **Purpose**: Compose or edit a note's text (and photo/paper style).
- **Layout**: Header: back-chevron left, "Store" primary button right. Below: a 3-way segmented control ("Write / Improve / Scan") that lets you jump to the other two screens for the SAME note-in-progress without losing the draft. Below that: a "Paper" swatch row — 4 small color circles (default bg, accent-tint, neutral-tint, cream-tint) plus a 5th "photo" swatch (small image icon) — selecting a swatch changes the note's background live; the selected swatch shows a text-colored ring.
- **Title**: borderless input, heading font, 24px, placeholder "Untitled", full width.
- **Body — two modes depending on Paper selection**:
  - **Flat color mode** (default): borderless textarea filling remaining height, ruled with horizontal lines every ~26px (like notebook paper) tinted to the selected paper color, body font 16px/26px line-height.
  - **Photo mode**: the ENTIRE remaining note area becomes a full-bleed droppable photo background (not a small inset box — the whole write area). An "×" button (top-right) removes the photo and reverts to flat-color mode. A caption strip fades in from the bottom showing the note text over a soft gradient scrim when not editing; a small pencil FAB (bottom-right) toggles into an overlay-textarea edit mode with a "Done" button to exit back to the plain photo view.
- **Constraint**: the photo is scoped per-note (each note's photo is independent, never shared/global).

### 5. Improve (AI)
- **Purpose**: Get an AI rewrite of the current note's text in a chosen tone.
- **Layout**: Header: back-chevron + "Improve writing" title. Below: a small hero illustration (a dot mid-rewrite — one rough wavy line becoming a smooth line, with sparkles) centered. Then the same "Write/Improve/Scan" segmented switcher as Editor. Then a "Tone" segmented control: Polish / Concise / Formal. Then "Original" (the note's current text, muted) and, once available, "Suggestion" (the rewritten text, full-color) separated by a hairline.
- **Footer**: "Discard" (ghost button) and "Apply" (primary button, disabled if there's no draft text yet) side by side.
- **Rewrite logic (reference behavior, not literal code)**: Polish = capitalize + ensure trailing punctuation. Concise = first sentence only. Formal = expand contractions (I'm→I am, don't→do not, etc.) + capitalize. Real implementation should call an actual LLM instead of these string rules.

### 6. Explanation ("Scan")
- **Purpose**: Photograph a book/document page, extract its text, and get an AI explanation of it.
- **Layout**: Header: back-chevron, "Scan a page" title, small dot-with-camera-icon mark on the right. Hero illustration (dot holding a magnifying glass) centered. The same 3-way screen-switcher segmented control. A 4:3 camera viewfinder box (droppable image placeholder pre-capture). "Capture page" primary button before a scan; after scanning, replaced by two stacked text blocks — "Extracted text" and "What it means" (separated by a hairline) — followed by "Copy" (secondary, with a checkmark micro-state after copying) and "Insert into note" (primary, appends extracted text into the note body and returns to Editor).

## Interactions & Behavior Summary
- Splash auto-advances after 1.6s or on tap; timer must be cleared on unmount/skip.
- All 4 home rows and the in-screen segmented "Write/Improve/Scan" switchers are wired to the SAME navigation actions — keep these in sync (a past bug in the prototype was these drifting out of sync; keep a single navigation function per target screen).
- A note in progress carries: title, body, kind (write/improve/scan — reflects which screen it "belongs" to for the Notes List tag and for reopening), paper color or photo flag.
- "Store"/Save always returns to Notes List.
- Back-chevron from any sub-screen returns to Home (not to the previous screen in history) — matches the prototype's flat navigation model. Confirm this is the desired IA before building; a stack-based back may be preferable in production.
- No animation on button presses beyond scale/opacity micro-feedback (0.15s ease transforms on hover/active).

## Design Tokens
- **Colors**: background `#f3f2f2`, text `#201f1d`, accent (gold/bronze) `#b68235` — use `accent-700` (a darkened step) for accent text/icons on the light ground, `accent-100` for tinted hover fills, `neutral-100/200` for paper tints, a hairline `divider` gray for rules.
- **Type**: Headings — Cormorant Garamond, semibold. Body — Lora, regular. Sizes used: 34px (splash wordmark), 26/24px (screen/editor titles), 20px (home row labels, header titles), 16px (body/textarea), 14–15px (card snippets, AI text), 12px (tags/labels), 11px uppercase (small "Paper" label).
- **Spacing**: generous — 20-24px screen padding, 12-16px gaps between stacked elements, 54px top padding under the status bar on every screen.
- **Radius**: small/medium radius on photo containers and viewfinder box (system default "md" token).
- **Shadows**: whisper-light — small shadow on the dot mark and FAB only.
- **Borders**: 1px hairlines for dividers and card outlines; no heavy borders.

## Assets
- No bitmap image assets — every icon in this prototype is hand-drawn inline SVG (the dot + bookshelf, dot + magnifying glass, dot + pencil-stroke, dot + sparkles). These should be recreated as proper vector icon assets (SVG/PDF/asset catalog) in the target codebase, ideally as a small named icon set so they're reusable and swappable.
- Photo drop targets (note background photo, camera viewfinder) are prototype-only placeholders — wire these to the real camera roll / camera capture APIs in production.

## Files
- `dotted.dc.html` — the full interactive prototype (all 6 screens, all states, all logic) in a single file. This is your primary reference — open it in a browser to see every interaction live.
- `ios-frame.jsx` — cosmetic iPhone device-frame chrome used only to preview the screens; not part of the app itself.
- `image-slot.js` — a drag-and-drop placeholder helper used for photo slots in the prototype; not part of the app itself.
