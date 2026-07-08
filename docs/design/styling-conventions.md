# Styling Conventions

This project uses **Skeleton UI v3** (`@skeletonlabs/skeleton` + `@skeletonlabs/skeleton-svelte`)
on **Tailwind v4**, with a custom theme (`socTheme`) defined in [`soc-theme.css`](../../soc-theme.css)
and global styles in [`src/app.css`](../../src/app.css).

Goal: consistent, simple, maintainable styling. Prefer **theme tokens + Skeleton presets** over raw
Tailwind palette colors and bespoke CSS. The guardrail `npm run lint:styles` (chained into
`npm run lint`) enforces the hard rules below.

## Color tokens

Use the seven semantic color bands — never raw Tailwind palette colors (`bg-blue-600`, `text-gray-700`, …).

| Use                          | Token       | Theme hue    |
| ---------------------------- | ----------- | ------------ |
| Brand / primary actions      | `primary`   | pink/red     |
| Accent (was "orange")        | `secondary` | gold/amber   |
| Links / info                 | `tertiary`  | blue         |
| Success                      | `success`   | green        |
| Warning                      | `warning`   | magenta      |
| Errors / destructive         | `error`     | red          |
| Structural chrome / neutrals | `surface`   | neutral grey |

Pattern: `{property}-{color}-{shade}` — e.g. `bg-primary-600`, `text-surface-900`, `border-secondary-300`.
For text/icons on a colored fill, use the contrast tokens: `text-primary-contrast-500`.

### Dark mode → Color Pairings

We use the `.dark` selector strategy (toggled by [`src/stores/mode.svelte.ts`](../../src/stores/mode.svelte.ts)).
**Do not write `dark:` variants.** Use Skeleton Color Pairings, which resolve via CSS `light-dark()`:

```html
<!-- instead of: bg-surface-50 dark:bg-surface-950 -->
<div class="bg-surface-50-950 text-surface-900-100">…</div>
```

⚠️ Only **balanced** pairings exist (the two shades must sum to 1000): `50-950`, `100-900`, `200-800`,
`300-700`, `400-600` and their reverses. A non-balanced combo like `surface-200-700` silently produces
**no CSS**. After adding a pairing, confirm it appears in the built CSS.

## Buttons & interactive elements

Use Skeleton's `btn` + a **preset**, not hand-rolled `rounded-md px-4 py-2 bg-… text-white …` strings.
Presets apply the correct contrast text automatically.

```html
<button class="btn preset-filled-primary-500">Save</button>
<button class="btn preset-tonal-surface">Cancel</button>
<button class="btn preset-filled-error-500">Delete</button>
```

Sizes: `btn-sm`, `btn-base` (default), `btn-lg`.

### Shared presets (defined in `src/app.css`)

- `.preset-nav-link` / `.preset-nav-link-surface` — top-nav links (see [`Navbar.svelte`](../../src/components/page/navigation/Navbar.svelte)).
- `.preset-chip-token` — removable selection chips / tags.

Add new reusable combinations as custom presets in `src/app.css` under `@layer components`, named
`preset-{name}`, composed with `@apply` from Skeleton/Tailwind primitives.

## Modals

Use the skeleton-svelte **`Modal`** component (this version does **not** have the docs' `Dialog`/`Portal`
compound API). For an externally-controlled modal, omit the `trigger` snippet and drive `open` /
`onOpenChange`. See [`ConfirmDialogue.svelte`](../../src/components/page/modals/ConfirmDialogue.svelte).

## Don't

- ❌ Raw palette colors: `bg-blue-600`, `text-gray-700`, `bg-orange-300`.
- ❌ `dark:` variants — use Color Pairings.
- ❌ Legacy `*-opacity-*` utilities (removed in Tailwind v4 — they render opaque). Use slash opacity:
  `bg-surface-950/50`.
- ❌ Hardcoded hex in components (`#007bff`, `#333`). Use `var(--color-*)` in `<style>` or token classes
  in markup.
- ❌ `!important` to beat Skeleton styles — prefer a Tailwind utility (e.g. `rounded-[20px]`) which wins
  via the utilities layer.

## Exceptions

The guardrail skips the `/dev` sandbox, Leaflet/map CSS (map-specific styling), and
`LiteYouTube.svelte` (YouTube-logo + over-media colors).

## Checking

```bash
npm run lint:styles   # styling guardrail only
npm run lint          # prettier + eslint + lint:styles
npm run check         # svelte-check (types)
```
