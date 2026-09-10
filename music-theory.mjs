export const NOTE_NAMES = Object.freeze({
  sharp: Object.freeze(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']),
  flat: Object.freeze(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']),
});

export const NATURAL_PCS = new Set([0, 2, 4, 5, 7, 9, 11]);

export const LAYOUTS = Object.freeze({
  ipad: Object.freeze({
    id: 'ipad',
    name: 'iPad',
    shortLabel: 'iPad · 13 × 5',
    columns: 13,
    rows: 5,
    baseMidi: 36,
    rowStep: 5,
    columnStep: 1,
    gridMinWidth: 650,
    description: '13 × 5 chromatic fourths layout. Right is one semitone; up is a perfect fourth.',
  }),
  iphone: Object.freeze({
    id: 'iphone',
    name: 'iPhone',
    shortLabel: 'iPhone · 5 × 5',
    columns: 5,
    rows: 5,
    baseMidi: 36,
    rowStep: 5,
    columnStep: 1,
    gridMinWidth: 300,
    description: '5 × 5 sequential chromatic layout. Each row continues five semitones above the row below.',
  }),
  push: Object.freeze({
    id: 'push',
    name: 'Ableton Push',
    shortLabel: 'Push · 8 × 8',
    columns: 8,
    rows: 8,
    baseMidi: 24,
    rowStep: 5,
    columnStep: 1,
    gridMinWidth: 480,
    description: '8 × 8 Push chromatic fourths layout. Right is one semitone; up is a perfect fourth.',
  }),
});

const pattern = (id, group, family, name, formula, intervals, voicing = false) =>
  Object.freeze({ id, group, family, name, formula, intervals: Object.freeze(intervals), voicing, sequence: false });

const phrase = (id, group, family, name, formula, intervals) =>
  Object.freeze({
    id,
    group,
    family,
    name,
    formula,
    intervals: Object.freeze(intervals),
    voicing: false,
    sequence: true,
  });

export const PATTERNS = Object.freeze([
  pattern('major', 'Scales', 'Scale', 'Major (Ionian)', '1 2 3 4 5 6 7', [0, 2, 4, 5, 7, 9, 11]),
  pattern('natural-minor', 'Scales', 'Scale', 'Natural minor (Aeolian)', '1 2 ♭3 4 5 ♭6 ♭7', [0, 2, 3, 5, 7, 8, 10]),
  pattern('harmonic-minor', 'Scales', 'Scale', 'Harmonic minor', '1 2 ♭3 4 5 ♭6 7', [0, 2, 3, 5, 7, 8, 11]),
  pattern('melodic-minor', 'Scales', 'Scale', 'Melodic minor', '1 2 ♭3 4 5 6 7', [0, 2, 3, 5, 7, 9, 11]),
  pattern('major-pentatonic', 'Scales', 'Scale', 'Major pentatonic', '1 2 3 5 6', [0, 2, 4, 7, 9]),
  pattern('minor-pentatonic', 'Scales', 'Scale', 'Minor pentatonic', '1 ♭3 4 5 ♭7', [0, 3, 5, 7, 10]),
  pattern('blues', 'Scales', 'Scale', 'Blues', '1 ♭3 4 ♭5 5 ♭7', [0, 3, 5, 6, 7, 10]),
  pattern('whole-tone', 'Scales', 'Scale', 'Whole tone', '1 2 3 ♯4 ♯5 ♭7', [0, 2, 4, 6, 8, 10]),
  pattern('diminished-wh', 'Scales', 'Scale', 'Diminished (whole–half)', '1 2 ♭3 4 ♭5 ♭6 6 7', [0, 2, 3, 5, 6, 8, 9, 11]),
  pattern('diminished-hw', 'Scales', 'Scale', 'Diminished (half–whole)', '1 ♭2 ♯2 3 ♯4 5 6 ♭7', [0, 1, 3, 4, 6, 7, 9, 10]),
  pattern('chromatic', 'Scales', 'Scale', 'Chromatic', '1 ♭2 2 ♭3 3 4 ♭5 5 ♭6 6 ♭7 7', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),

  pattern('ionian', 'Major-scale modes', 'Mode', 'Ionian', '1 2 3 4 5 6 7', [0, 2, 4, 5, 7, 9, 11]),
  pattern('dorian', 'Major-scale modes', 'Mode', 'Dorian', '1 2 ♭3 4 5 6 ♭7', [0, 2, 3, 5, 7, 9, 10]),
  pattern('phrygian', 'Major-scale modes', 'Mode', 'Phrygian', '1 ♭2 ♭3 4 5 ♭6 ♭7', [0, 1, 3, 5, 7, 8, 10]),
  pattern('lydian', 'Major-scale modes', 'Mode', 'Lydian', '1 2 3 ♯4 5 6 7', [0, 2, 4, 6, 7, 9, 11]),
  pattern('mixolydian', 'Major-scale modes', 'Mode', 'Mixolydian', '1 2 3 4 5 6 ♭7', [0, 2, 4, 5, 7, 9, 10]),
  pattern('aeolian', 'Major-scale modes', 'Mode', 'Aeolian', '1 2 ♭3 4 5 ♭6 ♭7', [0, 2, 3, 5, 7, 8, 10]),
  pattern('locrian', 'Major-scale modes', 'Mode', 'Locrian', '1 ♭2 ♭3 4 ♭5 ♭6 ♭7', [0, 1, 3, 5, 6, 8, 10]),

  pattern('mm1', 'Melodic-minor modes', 'Mode', 'Melodic minor', '1 2 ♭3 4 5 6 7', [0, 2, 3, 5, 7, 9, 11]),
  pattern('dorian-b2', 'Melodic-minor modes', 'Mode', 'Dorian ♭2', '1 ♭2 ♭3 4 5 6 ♭7', [0, 1, 3, 5, 7, 9, 10]),
  pattern('lydian-augmented', 'Melodic-minor modes', 'Mode', 'Lydian augmented', '1 2 3 ♯4 ♯5 6 7', [0, 2, 4, 6, 8, 9, 11]),
  pattern('lydian-dominant', 'Melodic-minor modes', 'Mode', 'Lydian dominant', '1 2 3 ♯4 5 6 ♭7', [0, 2, 4, 6, 7, 9, 10]),
  pattern('mixolydian-b6', 'Melodic-minor modes', 'Mode', 'Mixolydian ♭6', '1 2 3 4 5 ♭6 ♭7', [0, 2, 4, 5, 7, 8, 10]),
  pattern('locrian-natural2', 'Melodic-minor modes', 'Mode', 'Locrian ♮2', '1 2 ♭3 4 ♭5 ♭6 ♭7', [0, 2, 3, 5, 6, 8, 10]),
  pattern('altered', 'Melodic-minor modes', 'Mode', 'Altered', '1 ♭2 ♯2 3 ♭5 ♯5 ♭7', [0, 1, 3, 4, 6, 8, 10]),

  pattern('hm1', 'Harmonic-minor modes', 'Mode', 'Harmonic minor', '1 2 ♭3 4 5 ♭6 7', [0, 2, 3, 5, 7, 8, 11]),
  pattern('locrian-natural6', 'Harmonic-minor modes', 'Mode', 'Locrian ♮6', '1 ♭2 ♭3 4 ♭5 6 ♭7', [0, 1, 3, 5, 6, 9, 10]),
  pattern('ionian-augmented', 'Harmonic-minor modes', 'Mode', 'Ionian augmented', '1 2 3 4 ♯5 6 7', [0, 2, 4, 5, 8, 9, 11]),
  pattern('dorian-sharp4', 'Harmonic-minor modes', 'Mode', 'Dorian ♯4', '1 2 ♭3 ♯4 5 6 ♭7', [0, 2, 3, 6, 7, 9, 10]),
  pattern('phrygian-dominant', 'Harmonic-minor modes', 'Mode', 'Phrygian dominant', '1 ♭2 3 4 5 ♭6 ♭7', [0, 1, 4, 5, 7, 8, 10]),
  pattern('lydian-sharp2', 'Harmonic-minor modes', 'Mode', 'Lydian ♯2', '1 ♯2 3 ♯4 5 6 7', [0, 3, 4, 6, 7, 9, 11]),
  pattern('ultralocrian', 'Harmonic-minor modes', 'Mode', 'Ultralocrian', '1 ♭2 ♭3 ♭4 ♭5 ♭6 𝄫7', [0, 1, 3, 4, 6, 8, 9]),

  pattern('power5', 'Chords', 'Chord', 'Power chord', '1 5', [0, 7]),
  pattern('major-triad', 'Chords', 'Chord', 'Major triad', '1 3 5', [0, 4, 7]),
  pattern('minor-triad', 'Chords', 'Chord', 'Minor triad', '1 ♭3 5', [0, 3, 7]),
  pattern('diminished-triad', 'Chords', 'Chord', 'Diminished triad', '1 ♭3 ♭5', [0, 3, 6]),
  pattern('augmented-triad', 'Chords', 'Chord', 'Augmented triad', '1 3 ♯5', [0, 4, 8]),
  pattern('sus2', 'Chords', 'Chord', 'Suspended 2', '1 2 5', [0, 2, 7]),
  pattern('sus4', 'Chords', 'Chord', 'Suspended 4', '1 4 5', [0, 5, 7]),
  pattern('add9', 'Chords', 'Chord', 'Add 9', '1 3 5 9', [0, 2, 4, 7]),
  pattern('minor-add9', 'Chords', 'Chord', 'Minor add 9', '1 ♭3 5 9', [0, 2, 3, 7]),
  pattern('major6', 'Chords', 'Chord', 'Major 6', '1 3 5 6', [0, 4, 7, 9]),
  pattern('minor6', 'Chords', 'Chord', 'Minor 6', '1 ♭3 5 6', [0, 3, 7, 9]),
  pattern('major7', 'Chords', 'Chord', 'Major 7', '1 3 5 7', [0, 4, 7, 11]),
  pattern('dominant7', 'Chords', 'Chord', 'Dominant 7', '1 3 5 ♭7', [0, 4, 7, 10]),
  pattern('minor7', 'Chords', 'Chord', 'Minor 7', '1 ♭3 5 ♭7', [0, 3, 7, 10]),
  pattern('minor-major7', 'Chords', 'Chord', 'Minor-major 7', '1 ♭3 5 7', [0, 3, 7, 11]),
  pattern('half-diminished7', 'Chords', 'Chord', 'Half-diminished 7', '1 ♭3 ♭5 ♭7', [0, 3, 6, 10]),
  pattern('diminished7', 'Chords', 'Chord', 'Diminished 7', '1 ♭3 ♭5 𝄫7', [0, 3, 6, 9]),
  pattern('augmented-major7', 'Chords', 'Chord', 'Augmented major 7', '1 3 ♯5 7', [0, 4, 8, 11]),
  pattern('augmented7', 'Chords', 'Chord', 'Augmented dominant 7', '1 3 ♯5 ♭7', [0, 4, 8, 10]),
  pattern('dominant7sus4', 'Chords', 'Chord', 'Dominant 7 sus4', '1 4 5 ♭7', [0, 5, 7, 10]),
  pattern('major9', 'Chords', 'Chord', 'Major 9', '1 3 5 7 9', [0, 2, 4, 7, 11]),
  pattern('dominant9', 'Chords', 'Chord', 'Dominant 9', '1 3 5 ♭7 9', [0, 2, 4, 7, 10]),
  pattern('minor9', 'Chords', 'Chord', 'Minor 9', '1 ♭3 5 ♭7 9', [0, 2, 3, 7, 10]),
  pattern('dominant11', 'Chords', 'Chord', 'Dominant 11', '1 3 5 ♭7 9 11', [0, 2, 4, 5, 7, 10]),
  pattern('minor11', 'Chords', 'Chord', 'Minor 11', '1 ♭3 5 ♭7 9 11', [0, 2, 3, 5, 7, 10]),
  pattern('dominant13', 'Chords', 'Chord', 'Dominant 13 · no 11', '1 3 5 ♭7 9 13', [0, 2, 4, 7, 9, 10]),
  pattern('minor13', 'Chords', 'Chord', 'Minor 13 · no 11', '1 ♭3 5 ♭7 9 13', [0, 2, 3, 7, 9, 10]),
  pattern('dominant13-complete', 'Chords', 'Chord', 'Dominant 13 · complete', '1 3 5 ♭7 9 11 13', [0, 2, 4, 5, 7, 9, 10]),
  pattern('minor13-complete', 'Chords', 'Chord', 'Minor 13 · complete', '1 ♭3 5 ♭7 9 11 13', [0, 2, 3, 5, 7, 9, 10]),

  pattern('arp-major', 'Arpeggios', 'Arpeggio', 'Major triad', '1 3 5', [0, 4, 7]),
  pattern('arp-minor', 'Arpeggios', 'Arpeggio', 'Minor triad', '1 ♭3 5', [0, 3, 7]),
  pattern('arp-diminished', 'Arpeggios', 'Arpeggio', 'Diminished triad', '1 ♭3 ♭5', [0, 3, 6]),
  pattern('arp-augmented', 'Arpeggios', 'Arpeggio', 'Augmented triad', '1 3 ♯5', [0, 4, 8]),
  pattern('arp-major6', 'Arpeggios', 'Arpeggio', 'Major 6', '1 3 5 6', [0, 4, 7, 9]),
  pattern('arp-minor6', 'Arpeggios', 'Arpeggio', 'Minor 6', '1 ♭3 5 6', [0, 3, 7, 9]),
  pattern('arp-major7', 'Arpeggios', 'Arpeggio', 'Major 7', '1 3 5 7', [0, 4, 7, 11]),
  pattern('arp-dominant7', 'Arpeggios', 'Arpeggio', 'Dominant 7', '1 3 5 ♭7', [0, 4, 7, 10]),
  pattern('arp-minor7', 'Arpeggios', 'Arpeggio', 'Minor 7', '1 ♭3 5 ♭7', [0, 3, 7, 10]),
  pattern('arp-half-diminished7', 'Arpeggios', 'Arpeggio', 'Half-diminished 7', '1 ♭3 ♭5 ♭7', [0, 3, 6, 10]),
  pattern('arp-diminished7', 'Arpeggios', 'Arpeggio', 'Diminished 7', '1 ♭3 ♭5 𝄫7', [0, 3, 6, 9]),
  pattern('arp-major9', 'Arpeggios', 'Arpeggio', 'Major 9', '1 3 5 7 9', [0, 2, 4, 7, 11]),
  pattern('arp-dominant9', 'Arpeggios', 'Arpeggio', 'Dominant 9', '1 3 5 ♭7 9', [0, 2, 4, 7, 10]),
  pattern('arp-minor9', 'Arpeggios', 'Arpeggio', 'Minor 9', '1 ♭3 5 ♭7 9', [0, 2, 3, 7, 10]),

  pattern('voicing-major-root', 'Voicings', 'Voicing', 'Major triad · root position', '1–3–5', [0, 4, 7], true),
  pattern('voicing-major-first', 'Voicings', 'Voicing', 'Major triad · first inversion', '3–5–1', [4, 7, 12], true),
  pattern('voicing-major-second', 'Voicings', 'Voicing', 'Major triad · second inversion', '5–1–3', [7, 12, 16], true),
  pattern('voicing-minor-root', 'Voicings', 'Voicing', 'Minor triad · root position', '1–♭3–5', [0, 3, 7], true),
  pattern('voicing-minor-first', 'Voicings', 'Voicing', 'Minor triad · first inversion', '♭3–5–1', [3, 7, 12], true),
  pattern('voicing-minor-second', 'Voicings', 'Voicing', 'Minor triad · second inversion', '5–1–♭3', [7, 12, 15], true),
  pattern('voicing-maj7-close', 'Voicings', 'Voicing', 'Maj7 · close', '1–3–5–7', [0, 4, 7, 11], true),
  pattern('voicing-maj7-drop2', 'Voicings', 'Voicing', 'Maj7 · drop 2', '1–5–7–3', [0, 7, 11, 16], true),
  pattern('voicing-dom7-close', 'Voicings', 'Voicing', 'Dominant 7 · close', '1–3–5–♭7', [0, 4, 7, 10], true),
  pattern('voicing-dom7-drop2', 'Voicings', 'Voicing', 'Dominant 7 · drop 2', '1–5–♭7–3', [0, 7, 10, 16], true),
  pattern('voicing-min7-close', 'Voicings', 'Voicing', 'Minor 7 · close', '1–♭3–5–♭7', [0, 3, 7, 10], true),
  pattern('voicing-min7-drop2', 'Voicings', 'Voicing', 'Minor 7 · drop 2', '1–5–♭7–♭3', [0, 7, 10, 15], true),
  pattern('voicing-m7b5-drop2', 'Voicings', 'Voicing', 'Half-diminished 7 · drop 2', '1–♭5–♭7–♭3', [0, 6, 10, 15], true),
  pattern('voicing-dim7-drop2', 'Voicings', 'Voicing', 'Diminished 7 · drop 2', '1–♭5–𝄫7–♭3', [0, 6, 9, 15], true),
  pattern('voicing-maj-shell', 'Voicings', 'Voicing', 'Major shell', '1–3–7', [0, 4, 11], true),
  pattern('voicing-maj-shell-open', 'Voicings', 'Voicing', 'Major shell · open', '1–7–3', [0, 11, 16], true),
  pattern('voicing-dom-shell', 'Voicings', 'Voicing', 'Dominant shell', '1–3–♭7', [0, 4, 10], true),
  pattern('voicing-dom-shell-open', 'Voicings', 'Voicing', 'Dominant shell · open', '1–♭7–3', [0, 10, 16], true),
  pattern('voicing-min-shell', 'Voicings', 'Voicing', 'Minor shell', '1–♭3–♭7', [0, 3, 10], true),
  pattern('voicing-min-shell-open', 'Voicings', 'Voicing', 'Minor shell · open', '1–♭7–♭3', [0, 10, 15], true),
  pattern('voicing-quartal3', 'Voicings', 'Voicing', 'Quartal · three notes', '1–4–♭7', [0, 5, 10], true),
  pattern('voicing-quartal4', 'Voicings', 'Voicing', 'Quartal · four notes', '1–4–♭7–♭3', [0, 5, 10, 15], true),
  pattern('voicing-rootless-major', 'Voicings', 'Voicing', 'Major 13 · rootless', '3–6–7–9', [4, 9, 11, 14], true),
  pattern('voicing-rootless-dominant', 'Voicings', 'Voicing', 'Dominant 13 · rootless', '3–♭7–9–13', [4, 10, 14, 21], true),
  pattern('voicing-rootless-minor', 'Voicings', 'Voicing', 'Minor 11 · rootless', '♭3–♭7–9–11', [3, 10, 14, 17], true),

  phrase('lick-bebop-dominant-descent', 'Jazz phrases · bebop', 'Ordered phrase', 'Dominant bebop descent', '8–7–♭7–6–5–♯4–4–3–2–♭2–1', [12, 11, 10, 9, 7, 6, 5, 4, 2, 1, 0]),
  phrase('lick-bebop-major-ascent', 'Jazz phrases · bebop', 'Ordered phrase', 'Major bebop ascent', '1–2–3–4–5–♯5–6–7–8', [0, 2, 4, 5, 7, 8, 9, 11, 12]),
  phrase('lick-enclosure-third', 'Jazz phrases · bebop', 'Ordered phrase', 'Enclosure of the 3rd', '4–♭3–3', [5, 3, 4]),
  phrase('lick-enclosure-root', 'Jazz phrases · bebop', 'Ordered phrase', 'Enclosure of the root', '9–7–8', [14, 11, 12]),
  phrase('lick-chromatic-third', 'Jazz phrases · bebop', 'Ordered phrase', 'Chromatic approach to the 3rd', '♭3–3', [3, 4]),
  phrase('lick-the-lick', 'Jazz phrases · vocabulary', 'Ordered phrase', 'The Lick · minor', '1–2–♭3–4–2–7–1', [0, 2, 3, 5, 2, -1, 0]),
  phrase('lick-1235', 'Jazz phrases · vocabulary', 'Ordered phrase', '1–2–3–5 cell', '1–2–3–5', [0, 2, 4, 7]),
  phrase('lick-3579', 'Jazz phrases · vocabulary', 'Ordered phrase', '3–5–7–9 cell', '3–5–7–9', [4, 7, 11, 14]),
  phrase('lick-dominant-diminished', 'Jazz phrases · vocabulary', 'Ordered phrase', 'Dominant diminished ascent', '1–♭2–♯2–3–♯4–5–6–♭7–8', [0, 1, 3, 4, 6, 7, 9, 10, 12]),
  phrase('lick-altered-resolution', 'Jazz phrases · vocabulary', 'Ordered phrase', 'Altered dominant resolution', '♭7–♯5–♭5–3–♭9–1', [10, 8, 6, 4, 1, 0]),
  phrase('lick-major-ii-v-i', 'Jazz phrases · progressions', 'Ordered phrase', 'Major ii–V–I line', 'ii: 2–4–6–8 · V: 7–♭6–5–4 · I: 3–2–1', [2, 5, 9, 12, 11, 8, 7, 5, 4, 2, 0]),
  phrase('lick-minor-ii-v-i', 'Jazz phrases · progressions', 'Ordered phrase', 'Minor iiø–V–i line', 'iiø: 2–4–♭6–8 · V: 7–♭6–5–4 · i: ♭3–2–1', [2, 5, 8, 12, 11, 8, 7, 5, 3, 2, 0]),
]);

export const PATTERN_GROUPS = Object.freeze([...new Set(PATTERNS.map((entry) => entry.group))]);

const chord = (suffix, quality, intervals) => Object.freeze({ suffix, quality, intervals: Object.freeze(intervals) });

export const CHORD_DICTIONARY = Object.freeze([
  chord('5', 'Power chord', [0, 7]),
  chord('', 'Major triad', [0, 4, 7]),
  chord('m', 'Minor triad', [0, 3, 7]),
  chord('dim', 'Diminished triad', [0, 3, 6]),
  chord('aug', 'Augmented triad', [0, 4, 8]),
  chord('sus2', 'Suspended 2', [0, 2, 7]),
  chord('sus4', 'Suspended 4', [0, 5, 7]),
  chord('add9', 'Add 9', [0, 2, 4, 7]),
  chord('m(add9)', 'Minor add 9', [0, 2, 3, 7]),
  chord('6', 'Major 6', [0, 4, 7, 9]),
  chord('m6', 'Minor 6', [0, 3, 7, 9]),
  chord('maj7', 'Major 7', [0, 4, 7, 11]),
  chord('7', 'Dominant 7', [0, 4, 7, 10]),
  chord('m7', 'Minor 7', [0, 3, 7, 10]),
  chord('m(maj7)', 'Minor-major 7', [0, 3, 7, 11]),
  chord('m7♭5', 'Half-diminished 7', [0, 3, 6, 10]),
  chord('dim7', 'Diminished 7', [0, 3, 6, 9]),
  chord('aug(maj7)', 'Augmented major 7', [0, 4, 8, 11]),
  chord('7♯5', 'Augmented dominant 7', [0, 4, 8, 10]),
  chord('7sus4', 'Dominant 7 sus4', [0, 5, 7, 10]),
  chord('maj9', 'Major 9', [0, 2, 4, 7, 11]),
  chord('9', 'Dominant 9', [0, 2, 4, 7, 10]),
  chord('m9', 'Minor 9', [0, 2, 3, 7, 10]),
  chord('11', 'Dominant 11', [0, 2, 4, 5, 7, 10]),
  chord('m11', 'Minor 11', [0, 2, 3, 5, 7, 10]),
  chord('13', 'Dominant 13 (no 11)', [0, 2, 4, 7, 9, 10]),
  chord('13', 'Dominant 13 (complete)', [0, 2, 4, 5, 7, 9, 10]),
  chord('m13', 'Minor 13 (no 11)', [0, 2, 3, 7, 9, 10]),
  chord('m13', 'Minor 13 (complete)', [0, 2, 3, 5, 7, 9, 10]),
]);

export function mod(value, modulus = 12) {
  return ((value % modulus) + modulus) % modulus;
}

export function noteName(pitchClass, spelling = 'sharp') {
  const names = NOTE_NAMES[spelling] ?? NOTE_NAMES.sharp;
  return names[mod(pitchClass)];
}

export function midiNoteName(midi, spelling = 'sharp') {
  return `${noteName(midi, spelling)}${Math.floor(midi / 12) - 1}`;
}

export function isAccidental(pitchClass) {
  return !NATURAL_PCS.has(mod(pitchClass));
}

export function getLayout(layoutId) {
  return LAYOUTS[layoutId] ?? LAYOUTS.ipad;
}

export function padMidi(layoutId, rowFromBottom, column) {
  const layout = getLayout(layoutId);
  if (!Number.isInteger(rowFromBottom) || rowFromBottom < 0 || rowFromBottom >= layout.rows) {
    throw new RangeError(`Invalid row ${rowFromBottom} for ${layout.name}`);
  }
  if (!Number.isInteger(column) || column < 0 || column >= layout.columns) {
    throw new RangeError(`Invalid column ${column} for ${layout.name}`);
  }
  return layout.baseMidi + rowFromBottom * layout.rowStep + column * layout.columnStep;
}

export function layoutCells(layoutId) {
  const layout = getLayout(layoutId);
  const cells = [];
  for (let visualRow = 0; visualRow < layout.rows; visualRow += 1) {
    const rowFromBottom = layout.rows - 1 - visualRow;
    for (let column = 0; column < layout.columns; column += 1) {
      cells.push({
        rowFromBottom,
        visualRow,
        column,
        key: `${rowFromBottom}:${column}`,
        midi: padMidi(layoutId, rowFromBottom, column),
      });
    }
  }
  return cells;
}

export function layoutRange(layoutId) {
  const midis = layoutCells(layoutId).map((cell) => cell.midi);
  return { low: Math.min(...midis), high: Math.max(...midis) };
}

export function patternById(id) {
  return PATTERNS.find((entry) => entry.id === id) ?? PATTERNS[0];
}

export function patternPitchClasses(rootPitchClass, intervals) {
  return new Set(intervals.map((interval) => mod(rootPitchClass + interval)));
}

export function pitchClassSet(notes) {
  return [...new Set(notes.map((note) => mod(note)))].sort((a, b) => a - b);
}

function equalArrays(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function identifyChords(midiNotes, spelling = 'sharp') {
  if (!Array.isArray(midiNotes) || midiNotes.length < 2) return [];
  const validNotes = midiNotes.filter(Number.isFinite);
  if (validNotes.length < 2) return [];

  const pitchClasses = pitchClassSet(validNotes);
  const bassPitchClass = mod(Math.min(...validNotes));
  const matches = [];

  for (let root = 0; root < 12; root += 1) {
    for (const entry of CHORD_DICTIONARY) {
      const target = pitchClassSet(entry.intervals.map((interval) => root + interval));
      if (!equalArrays(pitchClasses, target)) continue;

      const rootLabel = noteName(root, spelling);
      const bassLabel = noteName(bassPitchClass, spelling);
      const inversion = bassPitchClass === root ? 'root position' : `${bassLabel} in the bass`;
      matches.push({
        name: `${rootLabel}${entry.suffix}${bassPitchClass === root ? '' : `/${bassLabel}`}`,
        root,
        bassPitchClass,
        quality: entry.quality,
        inversion,
      });
    }
  }

  return matches;
}

function positionCombinations(positionLists, index = 0, chosen = [], combinations = []) {
  if (index === positionLists.length) {
    combinations.push([...chosen]);
    return combinations;
  }
  for (const position of positionLists[index]) {
    chosen.push(position);
    positionCombinations(positionLists, index + 1, chosen, combinations);
    chosen.pop();
  }
  return combinations;
}

function positionScore(positions) {
  const rows = positions.map((position) => position.rowFromBottom);
  const columns = positions.map((position) => position.column);
  const rowSpan = Math.max(...rows) - Math.min(...rows);
  const columnSpan = Math.max(...columns) - Math.min(...columns);
  const area = (rowSpan + 1) * (columnSpan + 1);
  const distanceFromBottomLeft = positions.reduce(
    (sum, position) => sum + position.rowFromBottom * 2 + position.column,
    0,
  );
  return [area, rowSpan + columnSpan, distanceFromBottomLeft];
}

function compareScores(left, right) {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

export function resolveVoicing(layoutId, rootPitchClass, intervals) {
  const cells = layoutCells(layoutId);
  const positionsByMidi = new Map();
  for (const cell of cells) {
    const positions = positionsByMidi.get(cell.midi) ?? [];
    positions.push(cell);
    positionsByMidi.set(cell.midi, positions);
  }

  const rootCandidates = [...positionsByMidi.keys()]
    .filter((midi) => mod(midi) === mod(rootPitchClass))
    .sort((a, b) => a - b);

  const candidates = rootCandidates.map((rootMidi) => {
    const targetNotes = intervals.map((interval) => rootMidi + interval);
    const visibleNotes = targetNotes.filter((midi) => positionsByMidi.has(midi));
    return {
      rootMidi,
      targetNotes,
      visibleNotes,
      missingNotes: targetNotes.filter((midi) => !positionsByMidi.has(midi)),
      complete: visibleNotes.length === targetNotes.length,
    };
  });

  candidates.sort((left, right) => {
    if (left.complete !== right.complete) return left.complete ? -1 : 1;
    if (left.visibleNotes.length !== right.visibleNotes.length) return right.visibleNotes.length - left.visibleNotes.length;
    return left.rootMidi - right.rootMidi;
  });

  const chosen = candidates[0] ?? {
    rootMidi: null,
    targetNotes: [],
    visibleNotes: [],
    missingNotes: [],
    complete: false,
  };

  const positionLists = chosen.visibleNotes.map((midi) => positionsByMidi.get(midi));
  let positions = [];
  if (positionLists.length) {
    const combinations = positionCombinations(positionLists);
    combinations.sort((left, right) => compareScores(positionScore(left), positionScore(right)));
    positions = combinations[0];
  }

  return {
    ...chosen,
    positions,
    positionKeys: new Set(positions.map((position) => position.key)),
  };
}

function bestSequencePositions(positionLists) {
  if (!positionLists.length) return { positions: [], movement: 0 };

  let paths = positionLists[0].map((position) => ({
    position,
    positions: [position],
    cost: position.rowFromBottom * 0.02 + position.column * 0.01,
  }));

  for (const choices of positionLists.slice(1)) {
    const nextPaths = [];
    for (const position of choices) {
      const candidates = paths.map((path) => ({
        position,
        positions: [...path.positions, position],
        cost: path.cost
          + Math.abs(path.position.rowFromBottom - position.rowFromBottom)
          + Math.abs(path.position.column - position.column)
          + position.rowFromBottom * 0.02
          + position.column * 0.01,
      }));
      candidates.sort((left, right) => left.cost - right.cost);
      nextPaths.push(candidates[0]);
    }
    paths = nextPaths;
  }

  paths.sort((left, right) => left.cost - right.cost);
  return { positions: paths[0].positions, movement: paths[0].cost };
}

export function resolveSequence(layoutId, rootPitchClass, intervals) {
  const cells = layoutCells(layoutId);
  const positionsByMidi = new Map();
  for (const cell of cells) {
    const positions = positionsByMidi.get(cell.midi) ?? [];
    positions.push(cell);
    positionsByMidi.set(cell.midi, positions);
  }

  const rootCandidates = [...positionsByMidi.keys()]
    .filter((midi) => mod(midi) === mod(rootPitchClass))
    .sort((a, b) => a - b);

  const candidates = rootCandidates.map((rootMidi) => {
    const targetNotes = intervals.map((interval) => rootMidi + interval);
    const visibleSteps = targetNotes
      .map((midi, index) => ({ midi, step: index + 1 }))
      .filter(({ midi }) => positionsByMidi.has(midi));
    const path = bestSequencePositions(visibleSteps.map(({ midi }) => positionsByMidi.get(midi)));
    return {
      rootMidi,
      targetNotes,
      visibleSteps,
      missingSteps: targetNotes
        .map((midi, index) => ({ midi, step: index + 1 }))
        .filter(({ midi }) => !positionsByMidi.has(midi)),
      complete: visibleSteps.length === targetNotes.length,
      positions: path.positions,
      movement: path.movement,
    };
  });

  candidates.sort((left, right) => {
    if (left.complete !== right.complete) return left.complete ? -1 : 1;
    if (left.visibleSteps.length !== right.visibleSteps.length) return right.visibleSteps.length - left.visibleSteps.length;
    if (left.movement !== right.movement) return left.movement - right.movement;
    return left.rootMidi - right.rootMidi;
  });

  const chosen = candidates[0] ?? {
    rootMidi: null,
    targetNotes: [],
    visibleSteps: [],
    missingSteps: [],
    complete: false,
    positions: [],
    movement: 0,
  };
  const stepsByPosition = new Map();
  chosen.positions.forEach((position, index) => {
    const steps = stepsByPosition.get(position.key) ?? [];
    steps.push(chosen.visibleSteps[index].step);
    stepsByPosition.set(position.key, steps);
  });

  return {
    ...chosen,
    positionKeys: new Set(chosen.positions.map((position) => position.key)),
    stepsByPosition,
  };
}
