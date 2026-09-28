# Dense Motherfutz – Track-Dossier

Alles, was über den Track gemessen und festgelegt wurde, unabhängig von einem bestimmten Film oder
Look. Gedacht als Startpunkt für ein neues Projekt. Quelle der Messungen: `tools/analyze.mjs` (Features
in `films/dense-motherfutz/features.json`), Kammfilter-Fits und Gehör-Abgleich aus den Filmen in
diesem Repo (Stand 2026-09-28).

## Datei

| | |
|---|---|
| Quelle | `tracks/Dense Motherfutz.mp3` (lokal, nicht im Repo) |
| Arbeitskopie | `films/dense-motherfutz/track.wav`: 48 kHz, Stereo, 16 bit PCM, **192,00 s** |
| Lautheit (`track.wav`) | −8,4 LUFS integriert, LRA 9,2 LU, True Peak **+1,3 dBFS** (Master übersteuert leicht; nach AAC-Kodierung gemessen +4,7 dBFS) |
| Analyse-Befehl | `node analyze.mjs "../tracks/Dense Motherfutz.mp3" --film ../films/<name> --bpm 130 --downbeat 0.054` |

## Tempo und Raster

- **130,00 BPM**, 4/4, **104 Takte**, der Track endet exakt auf dem Ende von Takt 104.
- Schlag = 0,461538 s, Takt = 1,846154 s.
- **Takt 1 beginnt bei 0,054 s.** Takt n beginnt bei `0.054 + (n − 1) · 1.846154` s,
  Schlag q (0–3) darin bei `+ q · 0.461538` s.
- Belegt durch Kammfilter-Fit auf den Tiefpass-Onsets (< 90 Hz, 1 ms Auflösung) über den ganzen
  Track; Groove und Drop getrennt gefittet ergeben 130,00 und 129,99 BPM. Mittlere Abweichung der
  Kicks vom Raster 5,6 ms.
- Die „Eins“ ist bestätigt dadurch, dass mit 0,054 s alle großen Lautstärkesprünge exakt auf
  Taktlinien fallen (Takt 17, 61, 73).
- **Achtung, Auto-Analyse ohne Vorgaben liegt falsch:** Sie schätzt 129,09 BPM (driftet über den
  Track ~1,3 s) und setzt die Eins zwei Schläge daneben (bei gerader Bassdrum sind alle vier Schläge
  gleich laut). Deshalb immer `--bpm 130 --downbeat 0.054`.

## Aufbau

| Takte | Zeit (s) | Teil | Befund |
|---|---|---|---|
| 1–8 | 0,05–14,8 | Intro A | Kick allein, blendet ein (sauber, trocken) |
| 9–16 | 14,8–29,6 | Intro B | Kick gefiltert/weicher, Lowmid kommt, Build ab Takt 16 |
| 17–40 | 29,6–73,9 | Groove 1 | Voller Sub + Bass. 4-Takt-Muster: Takt 4 jeder Gruppe mit Höhen-Akzent, alle 8 Takte eine Variation |
| 41–56 | 73,9–103,4 | Groove 2 | Wie Groove 1, mehr Mitten/Höhen (neues Element ab Takt 41, noch nicht gegengehört) |
| 57–60 | 103,4–110,8 | Übergang | Höhen raus, Vorbereitung auf den Breakdown |
| 61–72 | 110,8–133,0 | Breakdown | Kick weg; Sub ab Takt 65 (118,2 s) fast weg; Riser Takt 69–72; Kick-Fill (Achtel) ab Takt 72, Schlag 3 |
| 73–96 | 133,0–177,3 | Drop | Maximum: Energie ~1,0, Höhen voll |
| 97–104 | 177,3–192,0 | Schluss | Energie bleibt, Höhen etwas zurück, harter Schluss auf Taktende |

**Der Drop ist 133,0 s (Takt 73).** Die Auto-Analyse setzt ihn auf 131,13 s (Takt 72), weil der Fill
dort beginnt. Den Fill als Anlauf behandeln, den Einschlag auf 133,0.

Auto-Sektionen aus `features.json` zum Vergleich (grob, nicht maßgeblich): calm 0–29,59 · peak
29,59–110,82 · breakdown 110,82–131,13 · drop 131,13–192,0.

## Wichtige Zeitpunkte

| Zeit (s) | Takt | Ereignis |
|---|---|---|
| 0,054 | 1 | Erster Kick, Einblenden |
| 14,82 | 9 | Intro B: Filter, Lowmid |
| 27,75 | 16 | Build |
| 29,59 | 17 | Groove: Sub und Bass setzen ein (großer Lautstärkesprung) |
| 73,90 | 41 | Groove 2: neues Element in Mitten/Höhen |
| 103,44 | 57 | Übergang, Höhen raus |
| 110,82 | 61 | Breakdown, Kick weg (großer Sprung) |
| 118,21 | 65 | Sub fast weg |
| 125,59 | 69 | Riser beginnt |
| 131,13 | 72 | Letzter Breakdown-Takt |
| 132,03 / 132,40 / 132,63 / 132,87 | 72 | Kick-Fill (erkannte Onsets, Stärke 0,90 / 0,77 / 1,00 / 0,95) |
| **132,98** | **73** | **Drop** |
| 177,28 | 97 | Schluss |
| 192,00 | Ende 104 | Harter Schluss |

## Schlagzeug und Signale

- **Kick:** gerade Bassdrum (Four on the Floor) in Takt 1–60 und 73–104; im Breakdown (61–72) keine,
  bis auf den Fill in Takt 72. **Die Kick-Erkennung ist in diesem Track unbrauchbar:** Im Groove
  erkennt der Detektor 200 „Kicks“ auf 176 Schläge, nur 101 davon auf dem Raster; im Drop 142 auf 132
  Schläge, nur 54 auf dem Raster. Der Rest sind Bassnoten zwischen den Schlägen. Kicks deshalb **aus
  dem Raster ableiten**, nicht aus der Erkennung. Bewährte Stärken: Takt 1–8 von 0,3 auf 0,6
  steigend, Takt 9–16 0,5, Takt 17–60 0,85, ab 73 1,0.
- **Claps/Snare:** auf Schlag 2 und 4 in Takt 17–60 und 73–104, dort wo der Detektor sie bestätigt.
  Die rohe Snare-Erkennung streut Treffer auf Achteln (674 „Snares“ insgesamt), taugt also nur
  gefiltert auf 2 und 4 (Spalte „auf 2/4“ unten).
- **Hats:** 1072 erkannte Onsets; brauchbar ab Stärke ≥ 0,3–0,4. Im Breakdown dünnen sie stark aus
  (Takt 70–71: 0–1 pro Takt).
- **Auf der 2,5** (Achtel nach Schlag 2) sitzt im Groove oft ein Element (Snare-Treffer 0,4–0,6 in
  Takt 17–20); ein Sonar-Ping auf `Takt + 1,5 Schläge` lag dort gut.
- **Bass-Pumpen:** über die Hüllkurven `bass`/`sub`, nicht über Kick-Treffer.

## Messwerte pro Takt

Mittelwerte der Hüllkurven aus `features.json` (0–1, pro Takt gemittelt), dazu die Zahl der Treffer
mit Stärke > 0,4. `build` ist der Riser-/Spannungswert des Analysers. Dezimalpunkt statt Komma, damit
die Tabelle maschinenlesbar bleibt. **„auf 2/4“ ist kein sicherer Clap-Nachweis:** Die Bassdrum liegt auf
jedem Schlag, also auch auf 2 und 4, und löst den Snare-Detektor mit aus; deshalb zeigt die Spalte
auch im Intro (ohne Claps) 2 pro Takt. Aussagekräftig ist sie nur im Breakdown, wo die Kick fehlt.

| Takt | Start (s) | energy | sub | bass | lowmid | mid | high | build | Hats | Snares | auf 2/4 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Intro A** | | | | | | | | | | | |
| 1 | 0.05 | 0.00 | 0.10 | 0.17 | 0.18 | 0.27 | 0.17 | 0.00 | 5 | 8 | 1 |
| 2 | 1.90 | 0.00 | 0.12 | 0.12 | 0.17 | 0.25 | 0.16 | 0.00 | 5 | 6 | 2 |
| 3 | 3.75 | 0.00 | 0.19 | 0.21 | 0.22 | 0.28 | 0.17 | 0.00 | 4 | 6 | 2 |
| 4 | 5.59 | 0.00 | 0.20 | 0.14 | 0.18 | 0.26 | 0.16 | 0.00 | 6 | 7 | 1 |
| 5 | 7.44 | 0.00 | 0.25 | 0.22 | 0.23 | 0.29 | 0.18 | 0.00 | 4 | 7 | 2 |
| 6 | 9.28 | 0.01 | 0.30 | 0.16 | 0.19 | 0.27 | 0.17 | 0.00 | 7 | 7 | 2 |
| 7 | 11.13 | 0.03 | 0.35 | 0.25 | 0.25 | 0.28 | 0.17 | 0.01 | 6 | 6 | 1 |
| 8 | 12.98 | 0.03 | 0.38 | 0.17 | 0.20 | 0.27 | 0.17 | 0.02 | 5 | 6 | 2 |
| **Intro B** | | | | | | | | | | | |
| 9 | 14.82 | 0.03 | 0.12 | 0.21 | 0.36 | 0.30 | 0.21 | 0.03 | 5 | 9 | 1 |
| 10 | 16.67 | 0.06 | 0.16 | 0.18 | 0.32 | 0.31 | 0.24 | 0.06 | 6 | 7 | 2 |
| 11 | 18.52 | 0.10 | 0.20 | 0.31 | 0.38 | 0.31 | 0.22 | 0.10 | 5 | 7 | 2 |
| 12 | 20.36 | 0.13 | 0.23 | 0.31 | 0.39 | 0.33 | 0.24 | 0.14 | 6 | 8 | 1 |
| 13 | 22.21 | 0.15 | 0.25 | 0.34 | 0.40 | 0.32 | 0.22 | 0.12 | 5 | 7 | 2 |
| 14 | 24.05 | 0.16 | 0.31 | 0.34 | 0.34 | 0.32 | 0.24 | 0.08 | 6 | 8 | 2 |
| 15 | 25.90 | 0.19 | 0.36 | 0.40 | 0.37 | 0.31 | 0.21 | 0.08 | 5 | 8 | 2 |
| 16 | 27.75 | 0.37 | 0.45 | 0.40 | 0.40 | 0.34 | 0.25 | 0.34 | 6 | 7 | 2 |
| **Groove 1** | | | | | | | | | | | |
| 17 | 29.59 | 0.69 | 0.92 | 0.80 | 0.53 | 0.55 | 0.31 | 0.81 | 6 | 6 | 2 |
| 18 | 31.44 | 0.82 | 0.87 | 0.78 | 0.49 | 0.51 | 0.29 | 0.98 | 6 | 6 | 2 |
| 19 | 33.28 | 0.82 | 0.91 | 0.78 | 0.53 | 0.56 | 0.31 | 0.79 | 6 | 5 | 2 |
| 20 | 35.13 | 0.79 | 0.87 | 0.65 | 0.45 | 0.50 | 0.40 | 0.31 | 5 | 6 | 2 |
| 21 | 36.98 | 0.74 | 0.90 | 0.77 | 0.58 | 0.58 | 0.32 | 0.01 | 7 | 2 | 2 |
| 22 | 38.82 | 0.72 | 0.87 | 0.75 | 0.52 | 0.53 | 0.28 | 0.00 | 6 | 8 | 2 |
| 23 | 40.67 | 0.72 | 0.89 | 0.77 | 0.56 | 0.58 | 0.31 | 0.00 | 7 | 5 | 2 |
| 24 | 42.52 | 0.77 | 0.90 | 0.65 | 0.49 | 0.52 | 0.40 | 0.05 | 5 | 7 | 2 |
| 25 | 44.36 | 0.82 | 0.92 | 0.80 | 0.57 | 0.57 | 0.37 | 0.16 | 8 | 6 | 2 |
| 26 | 46.21 | 0.84 | 0.87 | 0.79 | 0.55 | 0.54 | 0.32 | 0.18 | 7 | 5 | 2 |
| 27 | 48.05 | 0.83 | 0.92 | 0.78 | 0.58 | 0.57 | 0.38 | 0.08 | 8 | 6 | 2 |
| 28 | 49.90 | 0.80 | 0.87 | 0.69 | 0.53 | 0.53 | 0.42 | 0.01 | 6 | 6 | 2 |
| 29 | 51.75 | 0.74 | 0.89 | 0.77 | 0.61 | 0.60 | 0.38 | 0.00 | 9 | 4 | 2 |
| 30 | 53.59 | 0.72 | 0.87 | 0.75 | 0.57 | 0.57 | 0.32 | 0.00 | 7 | 6 | 2 |
| 31 | 55.44 | 0.72 | 0.89 | 0.77 | 0.61 | 0.62 | 0.38 | 0.00 | 9 | 5 | 2 |
| 32 | 57.28 | 0.78 | 0.90 | 0.66 | 0.51 | 0.58 | 0.42 | 0.04 | 6 | 6 | 2 |
| 33 | 59.13 | 0.83 | 0.92 | 0.80 | 0.59 | 0.58 | 0.40 | 0.16 | 10 | 5 | 2 |
| 34 | 60.98 | 0.84 | 0.87 | 0.78 | 0.53 | 0.55 | 0.37 | 0.17 | 7 | 4 | 2 |
| 35 | 62.82 | 0.83 | 0.92 | 0.78 | 0.58 | 0.58 | 0.41 | 0.08 | 9 | 7 | 2 |
| 36 | 64.67 | 0.80 | 0.87 | 0.65 | 0.50 | 0.54 | 0.45 | 0.00 | 7 | 6 | 2 |
| 37 | 66.52 | 0.75 | 0.89 | 0.76 | 0.63 | 0.61 | 0.43 | 0.00 | 9 | 5 | 2 |
| 38 | 68.36 | 0.73 | 0.87 | 0.74 | 0.55 | 0.58 | 0.39 | 0.00 | 7 | 7 | 2 |
| 39 | 70.21 | 0.74 | 0.89 | 0.76 | 0.61 | 0.61 | 0.44 | 0.00 | 9 | 5 | 2 |
| 40 | 72.05 | 0.80 | 0.90 | 0.65 | 0.51 | 0.59 | 0.47 | 0.07 | 7 | 7 | 1 |
| **Groove 2** | | | | | | | | | | | |
| 41 | 73.90 | 0.87 | 0.92 | 0.80 | 0.64 | 0.67 | 0.50 | 0.24 | 10 | 5 | 2 |
| 42 | 75.75 | 0.89 | 0.88 | 0.78 | 0.63 | 0.69 | 0.51 | 0.26 | 9 | 6 | 2 |
| 43 | 77.59 | 0.89 | 0.92 | 0.78 | 0.64 | 0.68 | 0.52 | 0.16 | 11 | 7 | 2 |
| 44 | 79.44 | 0.87 | 0.89 | 0.72 | 0.64 | 0.67 | 0.56 | 0.03 | 9 | 7 | 2 |
| 45 | 81.28 | 0.83 | 0.90 | 0.77 | 0.70 | 0.69 | 0.53 | 0.00 | 11 | 7 | 2 |
| 46 | 83.13 | 0.81 | 0.88 | 0.75 | 0.62 | 0.68 | 0.53 | 0.00 | 9 | 5 | 2 |
| 47 | 84.98 | 0.82 | 0.90 | 0.77 | 0.66 | 0.69 | 0.54 | 0.00 | 11 | 6 | 1 |
| 48 | 86.82 | 0.89 | 0.92 | 0.71 | 0.64 | 0.67 | 0.58 | 0.06 | 9 | 7 | 1 |
| 49 | 88.67 | 0.93 | 0.92 | 0.80 | 0.67 | 0.67 | 0.55 | 0.16 | 9 | 7 | 2 |
| 50 | 90.52 | 0.94 | 0.89 | 0.78 | 0.60 | 0.65 | 0.55 | 0.15 | 10 | 7 | 2 |
| 51 | 92.36 | 0.93 | 0.93 | 0.78 | 0.62 | 0.67 | 0.55 | 0.06 | 9 | 7 | 2 |
| 52 | 94.21 | 0.91 | 0.91 | 0.73 | 0.62 | 0.67 | 0.59 | 0.00 | 9 | 7 | 2 |
| 53 | 96.05 | 0.86 | 0.91 | 0.77 | 0.70 | 0.73 | 0.56 | 0.00 | 10 | 7 | 2 |
| 54 | 97.90 | 0.83 | 0.88 | 0.75 | 0.64 | 0.70 | 0.54 | 0.00 | 9 | 6 | 2 |
| 55 | 99.75 | 0.81 | 0.90 | 0.77 | 0.67 | 0.72 | 0.53 | 0.00 | 11 | 6 | 1 |
| 56 | 101.59 | 0.83 | 0.91 | 0.69 | 0.64 | 0.72 | 0.55 | 0.00 | 9 | 6 | 1 |
| **Übergang** | | | | | | | | | | | |
| 57 | 103.44 | 0.85 | 0.92 | 0.79 | 0.70 | 0.75 | 0.40 | 0.00 | 9 | 4 | 0 |
| 58 | 105.28 | 0.85 | 0.87 | 0.76 | 0.65 | 0.71 | 0.42 | 0.02 | 9 | 6 | 1 |
| 59 | 107.13 | 0.84 | 0.91 | 0.77 | 0.65 | 0.71 | 0.44 | 0.00 | 9 | 3 | 1 |
| 60 | 108.98 | 0.72 | 0.85 | 0.67 | 0.67 | 0.76 | 0.50 | 0.00 | 8 | 6 | 0 |
| **Breakdown** | | | | | | | | | | | |
| 61 | 110.82 | 0.47 | 0.41 | 0.57 | 0.72 | 0.76 | 0.44 | 0.00 | 10 | 4 | 1 |
| 62 | 112.67 | 0.37 | 0.36 | 0.54 | 0.69 | 0.73 | 0.46 | 0.00 | 7 | 4 | 1 |
| 63 | 114.52 | 0.37 | 0.39 | 0.58 | 0.72 | 0.75 | 0.46 | 0.00 | 9 | 5 | 1 |
| 64 | 116.36 | 0.36 | 0.41 | 0.54 | 0.74 | 0.78 | 0.50 | 0.00 | 7 | 5 | 0 |
| 65 | 118.21 | 0.30 | 0.12 | 0.48 | 0.68 | 0.75 | 0.40 | 0.00 | 5 | 2 | 0 |
| 66 | 120.05 | 0.26 | 0.07 | 0.45 | 0.63 | 0.69 | 0.41 | 0.00 | 7 | 4 | 2 |
| 67 | 121.90 | 0.26 | 0.05 | 0.42 | 0.63 | 0.70 | 0.43 | 0.00 | 6 | 5 | 1 |
| 68 | 123.75 | 0.30 | 0.09 | 0.45 | 0.66 | 0.73 | 0.49 | 0.01 | 4 | 7 | 1 |
| 69 | 125.59 | 0.32 | 0.10 | 0.45 | 0.72 | 0.77 | 0.47 | 0.11 | 5 | 5 | 1 |
| 70 | 127.44 | 0.38 | 0.10 | 0.42 | 0.60 | 0.66 | 0.56 | 0.25 | 1 | 3 | 1 |
| 71 | 129.28 | 0.52 | 0.34 | 0.49 | 0.59 | 0.78 | 0.67 | 0.48 | 0 | 1 | 0 |
| 72 | 131.13 | 0.75 | 0.64 | 0.64 | 0.60 | 0.73 | 0.77 | 0.83 | 4 | 4 | 1 |
| **Drop** | | | | | | | | | | | |
| 73 | 132.98 | 0.94 | 0.90 | 0.83 | 0.69 | 0.71 | 0.79 | 1.00 | 12 | 4 | 2 |
| 74 | 134.82 | 0.98 | 0.90 | 0.79 | 0.64 | 0.73 | 0.80 | 0.84 | 10 | 6 | 2 |
| 75 | 136.67 | 0.99 | 0.91 | 0.82 | 0.67 | 0.72 | 0.79 | 0.47 | 11 | 3 | 2 |
| 76 | 138.52 | 1.00 | 0.90 | 0.85 | 0.75 | 0.74 | 0.81 | 0.12 | 11 | 6 | 2 |
| 77 | 140.36 | 0.96 | 0.89 | 0.82 | 0.69 | 0.71 | 0.80 | 0.00 | 9 | 5 | 2 |
| 78 | 142.21 | 0.92 | 0.85 | 0.81 | 0.69 | 0.75 | 0.80 | 0.00 | 10 | 3 | 2 |
| 79 | 144.05 | 0.91 | 0.88 | 0.81 | 0.65 | 0.69 | 0.79 | 0.00 | 12 | 5 | 2 |
| 80 | 145.90 | 0.98 | 0.91 | 0.82 | 0.71 | 0.77 | 0.80 | 0.00 | 9 | 3 | 2 |
| 81 | 147.75 | 1.00 | 0.90 | 0.83 | 0.70 | 0.72 | 0.80 | 0.06 | 10 | 4 | 2 |
| 82 | 149.59 | 0.97 | 0.90 | 0.79 | 0.64 | 0.73 | 0.80 | 0.07 | 9 | 6 | 2 |
| 83 | 151.44 | 0.99 | 0.91 | 0.82 | 0.68 | 0.73 | 0.79 | 0.01 | 12 | 3 | 2 |
| 84 | 153.28 | 1.00 | 0.90 | 0.84 | 0.75 | 0.74 | 0.80 | 0.00 | 10 | 7 | 2 |
| 85 | 155.13 | 0.96 | 0.89 | 0.82 | 0.69 | 0.71 | 0.80 | 0.00 | 9 | 4 | 2 |
| 86 | 156.98 | 0.92 | 0.85 | 0.81 | 0.69 | 0.75 | 0.80 | 0.00 | 11 | 4 | 2 |
| 87 | 158.82 | 0.90 | 0.89 | 0.81 | 0.66 | 0.69 | 0.79 | 0.00 | 10 | 5 | 2 |
| 88 | 160.67 | 0.96 | 0.73 | 0.83 | 0.77 | 0.76 | 0.80 | 0.00 | 10 | 5 | 2 |
| 89 | 162.52 | 0.99 | 0.90 | 0.83 | 0.70 | 0.72 | 0.80 | 0.06 | 10 | 2 | 1 |
| 90 | 164.36 | 0.97 | 0.90 | 0.79 | 0.65 | 0.73 | 0.80 | 0.08 | 9 | 4 | 2 |
| 91 | 166.21 | 0.99 | 0.91 | 0.82 | 0.68 | 0.73 | 0.79 | 0.04 | 11 | 3 | 2 |
| 92 | 168.05 | 1.00 | 0.90 | 0.85 | 0.75 | 0.74 | 0.80 | 0.00 | 10 | 5 | 1 |
| 93 | 169.90 | 0.96 | 0.89 | 0.82 | 0.70 | 0.72 | 0.80 | 0.00 | 9 | 4 | 2 |
| 94 | 171.75 | 0.92 | 0.86 | 0.82 | 0.69 | 0.75 | 0.81 | 0.00 | 10 | 4 | 2 |
| 95 | 173.59 | 0.91 | 0.88 | 0.81 | 0.66 | 0.69 | 0.78 | 0.00 | 10 | 5 | 2 |
| 96 | 175.44 | 0.97 | 0.91 | 0.82 | 0.72 | 0.77 | 0.80 | 0.00 | 9 | 5 | 2 |
| **Schluss** | | | | | | | | | | | |
| 97 | 177.28 | 0.99 | 0.92 | 0.84 | 0.70 | 0.73 | 0.62 | 0.04 | 10 | 3 | 1 |
| 98 | 179.13 | 0.96 | 0.90 | 0.80 | 0.63 | 0.73 | 0.67 | 0.03 | 6 | 5 | 2 |
| 99 | 180.98 | 0.97 | 0.91 | 0.83 | 0.68 | 0.72 | 0.64 | 0.00 | 7 | 4 | 2 |
| 100 | 182.82 | 0.98 | 0.91 | 0.85 | 0.75 | 0.73 | 0.67 | 0.00 | 9 | 6 | 2 |
| 101 | 184.67 | 0.92 | 0.89 | 0.84 | 0.69 | 0.71 | 0.67 | 0.00 | 6 | 3 | 2 |
| 102 | 186.52 | 0.88 | 0.85 | 0.82 | 0.68 | 0.74 | 0.68 | 0.00 | 9 | 5 | 2 |
| 103 | 188.36 | 0.89 | 0.88 | 0.82 | 0.65 | 0.69 | 0.62 | 0.00 | 7 | 4 | 2 |
| 104 | 190.21 | 0.98 | 0.87 | 0.86 | 0.77 | 0.77 | 0.69 | 0.03 | 6 | 5 | 2 |

## Für ein neues Projekt

- Den Track neu analysieren mit `--bpm 130 --downbeat 0.054`, sonst stimmt das Raster nicht.
- Kick, Takt- und Schlaggrenzen aus der Formel oben berechnen, nicht aus der Erkennung.
- Reaktionen mit einem halben Frame Vorlauf auslösen (bei 30 fps: 1/60 s vor dem Onset), damit der
  Frame reagiert, der dem Treffer am nächsten liegt.
- Noch nicht gegengehört: ob der Drop wirklich auf 133,0 sitzt (sehr wahrscheinlich, Lautstärkesprung)
  und ob ab Takt 41 wirklich ein neues Element einsetzt.
