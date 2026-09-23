# test-beat

Pipeline-Beweis, kein Film. Track: `tools/make-test-track.mjs` (128 BPM, 34 Takte, Breakdown
30,0 s, Drop 45,0 s, 104 Kicks).

## Analyse gegen Wahrheit (2026-09-23)

| | Wahrheit | `analyze.mjs` |
|---|---|---|
| BPM | 128 | 128,03 |
| Sektionen | 0 / 30 / 45 | 0 / 30,0 breakdown / 45,0 drop |
| Kicks | 104 | 128 erkannt: 103 auf dem Beat, 25 Offbeat-Bassnoten (Stärke ≤ 0,43) |
| Intro→Groove bei 15 s | ja | nicht als eigene Sektion erkannt |

## Was das Bild zeigt

Synthwave-Sonne mit Slats (Kick pumpt Radius, Bass weitet Slats), Perspektivgrid mit einer Linie
pro Beat, Sterne auf Hats, Breakdown lässt die Sonne sinken und das Grid verlangsamen, Drop =
Pink-Flash + Chroma + Glitch-Tears. `vhs()` am Ende.

## Geprüft

- `verify.mjs` (Chromium): seek rein, Vertrag hält.
- Contact Sheet 5/20/20.2/35/44.9/45.05/45.3/55 s und 1:1-Crop bei 20 s angesehen.

## Schwächen

- Harte, teils schlammige Himmelsbänder (Pink-Haze über Midnight wird grünlich-grau).
- Sonne flach; kein Glow; Szene statisch außer Pump.
- Sterne nur im Drop sichtbar; Groove-Sektion nicht vom Intro unterschieden.
