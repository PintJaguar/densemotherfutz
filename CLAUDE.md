# riso-music

Privates, rein lokales Projekt (kein Azure DevOps, kein Remote). Musikvideos zu eigenen
elektronischen Tracks: das Bild reagiert auf Kick, Bass, Snare, Hats und Dramatik (Energie,
Builds, Breakdowns, Drops). Die globale CHRIST-Stack-Vorgabe (C#/Angular) gilt hier nicht; diese
Datei hat Vorrang.

Basis ist das Riso-Kit aus [sevenevesai/riso-windowseat](https://github.com/sevenevesai/riso-windowseat)
(MIT, siehe `LICENSE`): jede Arbeit ist eine `index.html` aus Canvas 2D ohne Libraries, jedes Frame
ist eine reine Funktion der Zeit (`seek(t)`), der Harness in `tools/` rendert Frame für Frame exakt.
Umgedreht gegenüber dem Original: dort folgt der Ton dem Bild, **hier folgt das Bild dem Track**.

## Stil

Riso als Technik (Halbtonraster, Farbplatten, Registerversatz, Überdrucke), Farben Synthwave /
VHS-Rip / Glitchcore: Fluo-Pink, Fluo-Orange, Aqua, Sunflower auf dunklen Überdrucken aus
Midnight + Purple + Indigo. Darüber als letzter Schritt `vhs()` (Chroma-Split, Scanlines,
Tracking-Band, Glitch-Tears, Bandrauschen). Richtung: Mischform — abstrakt/grafisch und
szenisch wechseln je nach Sektion des Tracks.

Vor dem Zeichnen `.claude/rules/riso-plates.md` und `docs/visual-development.md` lesen.
Skills: `music-film` für Musikvideos (dieser Workflow), `riso-film`/`riso-still` für das
allgemeine Handwerk. Technische Checks ersetzen kein künstlerisches Urteil; sagen, was angesehen
wurde und was nicht.

## Setup

```
cd tools && npm install && npm run setup && npm test
```

**Nur Chromium.** Firefox startet auf diesem Rechner nicht (`spawn UNKNOWN`, vermutlich AppLocker
auf `.exe` unter AppData). Default-Engine ist deshalb Chromium (`RISO_ENGINE`, `RISO_ENGINES` in
`tools/lib/browser.mjs`). Die Docs aus dem Original nennen Firefox als Primär-Engine; das gilt hier
nicht. Browser-Starts brauchen in Claude Code ggf. Ausführung außerhalb der Sandbox.

## Workflow (in `tools/`)

```
node analyze.mjs <track.wav|mp3|flac> --film ../films/<name> [--bpm 128]
node new-riso.mjs --kind music --out ../films/<name>/index.html
node still.mjs ../films/<name>/index.html --at 45 --out ../out/<name>-45.png
node shoot.mjs ../films/<name>/index.html --times 5,30,45,45.1 --sheet
node verify.mjs ../films/<name>/index.html
node render.mjs ../films/<name>/index.html --fps 30 --size 1080
node make-test-track.mjs      # synthetischer 128-BPM-Track mit bekannter Wahrheit
```

`analyze.mjs` schreibt `track.wav` (48 kHz Stereo), `features.js` und `features.json` in den
Filmordner und druckt BPM, Kick-Zahl und Sektionen. **Den Report immer gegen das Gehör prüfen**
(BPM, erster Downbeat, wo Breakdown und Drop wirklich liegen); bei falschem Tempo `--bpm` setzen.
Nach einer Re-Analyse ändern sich Hit-Indizes und damit Glitch-Seeds.

## Invarianten

- `window.__riso = { duration, ready, seek(t), audioFile?, renderAudio?, marks?, shots? }`.
  Musikfilme setzen `audioFile: 'track.wav'`; `render.mjs` muxt diese Datei.
- `seek(t)` ist rein in t. Kein `Math.random()` im Render-Pfad; `rngFor(key)`. Musikwerte nur über
  `M.*` (vorab analysiert), nie Web-Audio-Analyse zur Laufzeit. Ein Hook prüft `films/`.
- VHS-Rauschen wird pro Frame-Index geseedet, Glitch-Slices pro Hit-Index (`glitchKey`).
- Szenen in Anzeigegröße backen; nie ein gerastertes Bitmap skalieren (Moiré).
- Kein reines Schwarz: Tiefen sind Überdrucke; helle Motive (Sonne, Neonlinien) erst aus allen
  dunklen Platten knocken, dann drucken.
- Eigene Tracks (`tracks/`, `films/*/track.wav`) sind git-ignoriert.

## Karte

| Pfad | Inhalt |
|---|---|
| `films/<name>/` | Eigene Musikvideos: `index.html`, `FILM.md`, `features.*`, `track.wav` |
| `films/test-beat/` | Pipeline-Beweis auf dem synthetischen Test-Track (kein fertiger Film) |
| `tools/analyze.mjs` | Track → Features (Bänder, Hits, BPM/Grid, Sektionen, Drops) |
| `tools/lib/music-kit.js` | `M.*`-Zugriff, Synthwave-Inks, `vhs()`; wird in neue Filme kopiert |
| `reference/films/` | Die Originalfilme als Routinen-Spender (nie deren Szenen kopieren) |
| `docs/`, `studies/`, `prints/workings/` | Handwerk aus dem Original-Kit |
