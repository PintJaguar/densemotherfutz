---
name: music-film
description: Make or revise a music video for one of the user's own electronic tracks in this repo — riso technique, synthwave/VHS/glitch palette, picture driven by kick, bass, snare, hats, energy, builds, breakdowns and drops. Delivers films/<name>/index.html plus a muxed MP4. Use for "Video zu meinem Track", "mach den Drop härter", "reagiert zu wenig auf die Kick" and similar.
---

# Music film

Deliver `films/<name>/index.html`, `films/<name>/FILM.md` and `out/<name>.mp4` with the user's
track muxed. Commands run in `tools/`. Read `CLAUDE.md` first; the craft rules of `riso-film`
(`.claude/skills/riso-film/SKILL.md`) apply unless this file says otherwise.

## 1. Listen through the data

```
node analyze.mjs <track> --film ../films/<name>
```

Read the report. Check BPM against the user's DAW value if they know it (`--bpm` overrides), and
whether the section list matches the arrangement (intro, groove, breakdown, drop, outro). Ask the
user for the arrangement when the report is ambiguous; they made the track and know it better
than any detector. Kick strengths below ~0.45 are often bass notes, not kicks: gate with `minS`.

## 2. Design against the arrangement

Write `FILM.md` early: one row per section with its visual world (abstract or scene — the chosen
direction is a mix), what the kick, bass, snare, hats and energy each drive there, and the drop
moments. Map roles, not everything to everything:

| Musical signal | Typical role |
|---|---|
| `M.hit('kick')` | Pump: scale, camera push, flash, grid step. Short decay (0.2–0.35 s). |
| `M.val('bass'/'sub')` | Mass: slat width, floor glow, slow deformation. |
| `M.hit('snare')` | Accent: cut, colour-plate swap, registration jolt. |
| `M.hit('hat')` | Sparkle: stars, particles, scanline shimmer. |
| `M.val('energy')` | Density and saturation of the whole frame. |
| `M.val('build')` | Tension: tracking band, rising chroma, camera creep. |
| `M.section(t).kind` / `M.sinceDrop(t)` | World changes and the big hits. |

Hold something back for the drop: if the kick already glitches the frame in the intro, the drop
has nowhere to go. Breakdowns should visibly breathe out.

## 3. Build

```
node new-riso.mjs --kind music --out ../films/<name>/index.html
```

Prove the drop frame and one groove frame first (`still.mjs`, 1:1 crops), then the timeline.
`vhs()` runs last in `drawArt`. Keep `SHOTS` derived from `M.sections`.

## 4. Check sync and motion

```
node shoot.mjs ../films/<name>/index.html --around <drop> --window 0.4 --sheet
node verify.mjs ../films/<name>/index.html
node render.mjs ../films/<name>/index.html --from <a> --to <b> --out ../out/<name>-part.mp4
```

Look at frame strips around each drop and a few kicks: the reaction must land on the frame of the
hit, not one late. Range renders are silent; judge sync on the full render with sound. Then:

```
node render.mjs ../films/<name>/index.html --fps 30 --size 1080
```

Decode the MP4 (duration, frames, audio stream). Record in `FILM.md` what was checked, what was
only seen on sheets, and what still looks weak. The user's eye and ear approve the film.
