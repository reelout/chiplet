# Consumer tree-shaking evidence for `sideEffects: ["**/*.css"]`

Simulates a real consumer importing the packed library and building with Vite, to verify that unused components and their associated CSS files are tree-shaken.

## Procedure

1. `pnpm build` (rollup library build) in the repo root.
2. Pack the with-field tarball first; then produce the baseline by temporarily checking out main's manifest (`pnpm pack` always emits `chiplet-0.3.0.tgz`, so rename each tarball aside):

   ```sh
   pnpm pack && mv chiplet-0.3.0.tgz chiplet-0.3.0-with-field.tgz
   git checkout main -- package.json
   pnpm pack && mv chiplet-0.3.0.tgz chiplet-0.3.0-baseline.tgz
   git checkout HEAD -- package.json
   ```

   `pnpm pack` resolves `catalog:` dependencies to real version ranges in both.

3. Create a consumer app per tarball: `react@^19.3.1`, `react-dom@^19.3.1`, `vite@^8.3.8`, `@vitejs/plugin-react@^6.3.0`, `chiplet: file:<tarball>`. Entry imports only `Body1`:

   ```tsx
   import { createRoot } from 'react-dom/client'
   import { Body1 } from 'chiplet'

   const container = document.getElementById('root')

   if (container) {
     createRoot(container).render(<Body1>Tree-shaking consumer</Body1>)
   }
   ```

4. `pnpm install --prefer-offline && pnpm exec vite build` in each consumer.
5. Grep the emitted `dist/assets/*` bundles for the per-family markers below (class-name strings unique to each component family's compiled CSS/JS):

   | Family     | CSS marker            | JS marker                              |
   | ---------- | --------------------- | -------------------------------------- |
   | typography | `_1e4y7ii4` (Body1)   | `_1e4y7ii4`, `_1e4y7ii0` (unused glue) |
   | button     | `_1cabe9mp`           | `_1cabe9m1k` (glue var)                |
   | select     | `_1asxz9rl`           | `_1asxz9ru` (glue var)                 |
   | checkbox   | `lxgrduo`             | `lxgrduo`                              |
   | popover    | `_1b443hhi`           | `_1b443hhi`                            |
   | input      | `_6iao7kk`            | `_6iao7kk`                             |
   | header     | `_1c43omu0`           | `_1c43omu0`                            |
   | progress   | `buu2zw6` (keyframes) | `buu2zw6` (keyframes)                  |

## Results (vite 8.3.8, 2026-11-18)

| Bundle | with `sideEffects`        | without (baseline)         |
| ------ | ------------------------- | -------------------------- |
| JS     | 219.94 kB (gzip 68.77 kB) | 399.83 kB (gzip 119.54 kB) |
| CSS    | 23.24 kB (gzip 2.98 kB)   | 50.37 kB (gzip 7.82 kB)    |

### With `sideEffects: ["**/*.css"]`

- JS contains `Body1`'s class `_1e4y7ii4` (used component kept) and zero occurrences of every unused-family JS marker: `_1cabe9m1k` (button), `_1asxz9ru` (select), `lxgrduo` (checkbox), `_1b443hhi` (popover), `_6iao7kk` (input), `_1c43omu0` (header), `buu2zw6` (progress); `_1e4y7ii0` (unused typography glue var) is also absent, as expected.
- CSS contains `._1e4y7ii4{font:var(--_15shvv45)}` with the full token chain resolvable (`--_15shvv45` → `--_1ajkdfx4b: normal`, `--_1ajkdfx4a: 1rem`, …) and zero occurrences of every unused-family CSS marker: `_1cabe9mp` (button), `_1asxz9rl` (select), `lxgrduo` (checkbox), `buu2zw6` (progress), `_6iao7kk` (input), `_1c43omu0` (header), `_1b443hhi` (popover).

### Without the field (baseline)

- Every family's CSS marker is present in the CSS bundle (`_1e4y7ii4` ×1, `_1cabe9mp` ×2, `_1asxz9rl` ×2, `lxgrduo` ×1, `buu2zw6` ×2, `_6iao7kk` ×9, `_1c43omu0` ×1, `_1b443hhi` ×4) — nothing is tree-shaken, confirming the field is what enables the shaking.

## Conclusion

`sideEffects: ["**/*.css"]` lets a consumer's `vite build` drop all unused component JS and its associated per-family CSS, while preserving the used component's CSS (CSS files stay non-shakeable) with an intact token chain: −45% JS (−180 kB) and −54% CSS (−27 kB) for a single-component import.

## Reproduction notes

- Tarballs and consumer apps lived in a temp dir and are not archived; the procedure above recreates them from any checkout of this branch.
- Shared CSS (`token.css.ts`, `theme.css.ts`) and, where imported, `global.css.ts` remain in the used component's graph by design.
