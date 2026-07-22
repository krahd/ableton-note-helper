# Ableton Note Helper

Interactive reference and practice tool for Ableton Note and Ableton Push pad layouts.

## Live site

<https://krahd.github.io/abeton-note-helper/>

## Features

- Three selectable layouts:
  - **iPad** — 13 columns × 5 rows, bottom-left C2, chromatic fourths.
  - **iPhone** — 5 columns × 5 rows, C2–C4 sequential chromatic layout matching Ableton Note on iPhone.
  - **Ableton Push** — 8 columns × 8 rows, bottom-left C1, chromatic fourths.
- Multiple simultaneous charts with independently selectable roots and patterns.
- Scales, major-scale modes, melodic-minor modes, harmonic-minor modes, chords, arpeggios and exact voicings.
- Four-colour note display: blue root, orange pattern tones, black unused naturals and grey unused accidentals.
- Exact voicings select one physical pad per note rather than every duplicate occurrence.
- Tap pads to identify chord symbols, alternative interpretations and inversions.
- Sharp/flat spelling, linked/unlinked roots and persistent preferences.
- Responsive, accessible and dependency-free static application.

## Run locally

Because the application uses JavaScript modules, serve the directory rather than opening `index.html` directly:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Tests

```sh
node --check app.js
node --check music-theory.mjs
node tests.mjs
```

Tests cover all three grid geometries, the iPhone screenshot mapping, music-theory data, chord recognition, inversions and exact voicing placement.

## Deployment

GitHub Pages deploys automatically from `main` through `.github/workflows/pages.yml` after the test job succeeds.

## Licence

MIT
