# Consumer tree-shaking evidence for `sideEffects: ["**/*.css"]`

Simulates a real consumer importing the packed library and building with Vite, to verify that unused components and their associated CSS files are tree-shaken.

## Procedure

1. `pnpm build` (rollup library build) in the repo root.
2. `pnpm pack` twice: once with the `sideEffects` field present in `package.json`, once with it removed (via `git stash`), producing two tarballs (`chiplet-0.3.0-with-sideseffects.tgz`, `chiplet-0.3.0-without-sideseffects.tgz`). `pnpm pack` resolves `catalog:` dependencies to real version ranges in both.
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
5. Grep the emitted `dist/assets/*` bundles for per-family markers (class-name strings unique to each component family's compiled CSS/JS): typography `_1e4y7ii4`, button `_1cabe9mp`/`_1cabe9m1k`, select `_1asxz9rl`/`_1asxz9ru`, checkbox `lxgrduo`, popover `_1b443hhi`, input `_6iao7kk`, header `_1c43omu0`, progress keyframes `buu2zw6`.

## Results (vite 8.3.8, 2026-11-18)

| Bundle | with `sideEffects`        | without (baseline)         |
| ------ | ------------------------- | -------------------------- |
| JS     | 219.94 kB (gzip 68.77 kB) | 399.83 kB (gzip 119.54 kB) |
| CSS    | 23.24 kB (gzip 2.98 kB)   | 50.37 kB (gzip 7.82 kB)    |

### With `sideEffects: ["**/*.css"]`

- JS contains `Body1`'s class `_1e4y7ii4` (used component kept); contains zero occurrences of every unused family marker (`_1cabe9m1k`, `_1asxz9ru`, `lxgrduo`, `_1b443hhi`, `_6iao7kk`, `_1c43omu0`, `buu2zw6`).
- CSS contains `._1e4y7ii4{font:var(--_15shvv45)}` and the full token chain resolves (`--_15shvv45` → `--_1ajkdfx4b: normal`, `--_1ajkdfx4a: 1rem`, …). CSS contains zero occurrences of button, select, checkbox, popover, input, header, and progress CSS.

### Without the field (baseline)

- Every family marker is present in the CSS bundle (`_1cabe9mp` ×2, `_1asxz9rl` ×2, `lxgrduo` ×1, `buu2zw6` ×2, `_6iao7kk` ×9, `_1c43omu0` ×1, `_1b443hhi` ×4) — nothing is tree-shaken, confirming the field is what enables the shaking.

## Conclusion

`sideEffects: ["**/*.css"]` lets a consumer's `vite build` drop all unused component JS and its associated per-family CSS, while preserving the used component's CSS (CSS files stay non-shakeable) with an intact token chain: −45% JS (−180 kB) and −54% CSS (−27 kB) for a single-component import.

## Reproduction notes

- Tarballs and consumer apps lived in a temp dir and are not archived; the procedure above recreates them from any checkout of this branch.
- Shared CSS (`token.css.ts`, `theme.css.ts`) and, where imported, `global.css.ts` remain in the used component's graph by design.
