# Runtime typography

**Current (human decision 2026-11-10):** all text uses local **Montserrat** 400/700 from `src/app/fonts/montserrat/` (latin + latin-ext subsets, SIL OFL in `OFL.txt`), declared in `globals.css` and set through `--gui-font-ui`, `--gui-font-brand`, `--gui-font-editorial` and the marketplace `--pp-font*` variables. Headings keep weight 400; 500/600 requests render with the nearest available weight. No remote font requests. The paragraph below describes the previous Geist Serif setup, kept for history.

The application loads local Geist Serif Regular 400 from `docs/design-system/agent-kit/assets/fonts/GeistSerif-Regular.woff2` through Vite. Its SIL OFL license remains beside the font. All headings use this weight without synthetic bold. Body and controls use Arial/Helvetica/system sans; they make no remote font requests.

## Retained historical assets

# Timeless Sans Variable

`timeless-sans-variable.woff2` is the free Timeless Sans variable font served by the official
[Timeless Type](https://timeless.co/type) website. The vendor describes the Timeless family as
free for personal and commercial use.

The previous runtime used the Grotesk cut with `STYL` and `ital` pinned to `0`. These are existing implementation assets, not the target for new headings. Follow the accepted [design-system integration guide](../../../docs/design-system/README.md), which supplies local Geist Serif Regular and its license.

## Web-optimized Grotesk

`timeless-grotesk-web-variable.woff2` is generated from the original asset by
pinning `STYL=0` and `ital=0`, matching the existing global theme settings. It keeps
all 417 mapped Unicode characters, glyph coverage and the weight axis (300–800),
while discarding unused stylistic/italic interpolation. The original is retained.

Generate with FontTools `varLib.instancer` using those axis values and WOFF2 output;
preserve timestamps for repeatability. FontTools is asset tooling, not a runtime dependency.
These retained Timeless assets are no longer loaded by the application.
