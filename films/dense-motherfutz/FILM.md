# Dense Motherfutz

Track: `tracks/Dense Motherfutz.mp3`, 192,00 s = exakt 104 Takte à 4/4.

```
node analyze.mjs "../tracks/Dense Motherfutz.mp3" --film ../films/dense-motherfutz --bpm 130 --downbeat 0.054
```

## Tempo und Raster (gemessen, noch nicht gegengehört)

- **130,00 BPM.** Kammfilter-Fit auf den Tiefpass-Onsets (< 90 Hz, 1 ms Auflösung) über den
  ganzen Track; Groove und Drop getrennt gefittet ergeben 130,00 und 129,99. Mittlere
  Abweichung der Kicks vom Raster 5,6 ms. Der Auto-Report sagte 129,09 — falsch, driftet über
  den Track ~1,3 s.
- **Takt 1 beginnt bei 0,054 s.** Die Auto-Wahl der „Eins“ lag zwei Schläge daneben (bei
  gerader Bassdrum sind alle vier Schläge gleich laut). Belegt dadurch, dass mit 0,054 s alle
  Lautstärkesprünge exakt auf Taktlinien fallen (Takt 17, 61, 73).
- Takt n beginnt bei `0.054 + (n-1) · 1.8462` s.

## Aufbau

| Takte | Zeit (s) | Teil | Befund |
|---|---|---|---|
| 1–8 | 0,05–14,8 | Intro A | Kick allein, blendet ein (sauber, trocken) |
| 9–16 | 14,8–29,6 | Intro B | Kick gefiltert/weicher, Lowmid kommt, Build ab Takt 16 |
| 17–40 | 29,6–73,9 | Groove 1 | Voller Sub + Bass. 4-Takt-Muster: Takt 4 jeder Gruppe mit Höhen-Akzent, alle 8 Takte eine Variation |
| 41–56 | 73,9–103,4 | Groove 2 | Wie Groove 1, aber mehr Mitten/Höhen (neues Element ab Takt 41) |
| 57–60 | 103,4–110,8 | Übergang | Höhen raus, Vorbereitung auf den Breakdown |
| 61–72 | 110,8–133,0 | Breakdown | Kick weg; Sub ab Takt 65 (118,2) fast weg; Riser Takt 69–72; Kick-Fill (Achtel) ab Takt 72, Schlag 3 |
| 73–96 | 133,0–177,3 | Drop | Maximum: Energie ~1,0, Höhen voll |
| 97–104 | 177,3–192,0 | Schluss | Energie bleibt, Höhen etwas zurück, harter Schluss auf Taktende |

Der Report setzt den Drop auf 131,1 (Takt 72) wegen des Fills; der eigentliche Drop ist
**133,0 s (Takt 73)**. Im Film den Fill als Anlauf behandeln, den Einschlag auf 133,0.

## Wichtig fürs Bauen: `M.hit('kick')` ist in diesem Track unbrauchbar

Im Groove erkennt der Detektor 200 „Kicks“ auf 176 Schläge, nur 101 davon auf dem Raster; im
Drop 142 auf 132 Schläge, nur 54 auf dem Raster. Der Rest sind Bassnoten zwischen den Schlägen.
Weil die Bassdrum gerade durchläuft, die Kick **aus dem Raster ableiten** (jeder Schlag in den
Takten 1–60 und 73–104, im Breakdown keine, Fill in Takt 72 aus den erkannten Hits) statt aus
`M.hit('kick')`. Bass-Pumpen dann über `M.val('bass'/'sub')`.

## Konzept: Tiefsee-Abstieg (gewählt 2026-09-25)

Ein kleines Tauchboot sinkt durch den Track. Als Stilreferenz dient ein ChatGPT-Triptychon
(Konzept 5 in `story-prompts.md`):
- links: flaches Aqua-Wasser mit Sonar-Ringen, Fischschwärmen, Korallen in Pink/Orange
  und einem Lichtkegel in Sunflower
- Mitte: Leere aus Midnight und Indigo, nur Boot, Licht und Blasenspur
- rechts: eine riesige Qualle in Fluo-Pink/Orange, Druckwellen-Ringe, starke VHS-Streifen

Die Referenz ist Stimmung, keine Vorlage; das Bild muss aus Platten und Raster gebaut werden.

## Gebaut (Stand 2026-09-25, erste Fassung; Takt 41–74 durch Runde 2 ersetzt)

Die Zeitachse ist `PARTS` in `index.html`, abgeleitet aus dem Takt-Raster (`T(n)`), nicht aus
`M.sections`. Die Kick kommt aus dem Raster (`KICKS`), der Fill in Takt 72 aus den erkannten Onsets.
Alle Hit-Reaktionen laufen mit einem halben Frame Vorlauf (`LEAD`), damit der Frame reagiert, der dem
Onset am nächsten liegt. Der Abstieg ist eine tabellierte Scroll-Funktion: pro Teil eine feste Strecke,
die auf jeder Kick einen Schub bekommt.

| Takte | Teil | Bild | Signale |
|---|---|---|---|
| 1–8 | Intro A | Boot treibt an der Oberfläche, Streifensonne sinkt über das ganze Intro, Riff links | Sonar-Ping auf der 1 jedes Takts (Stärke steigt mit dem Einblenden) |
| 9–16 | Intro B | Boot kippt und taucht ab, Oberfläche scrollt aus dem Bild, Lampe geht an | Sonar auf der 1; jede Kick = Schub |
| 17–40 | Groove 1 | Aqua-Flachwasser, Korallen (Pink/Orange/Sunflower) an der Felswand, Lichtschächte, Fischschwärme alle 8 Takte | Sonar auf der 1; jede Kick = Schub, Schwarm zuckt zusammen; Bass = Korallen-Schwingen |
| 41–56 | Groove 2 | Wasser kippt über Blau, Korallen enden, Schwebeteilchen nehmen zu | wie Groove 1, Hats = Funkeln der Schwebeteilchen |
| 57–60 | Übergang | Keine Lichtschächte, Lampe flackert, Abstieg rast, Tracking-Band | |
| 61–72 | Breakdown | Leere aus Überdrucken, nur Boot, Lampe, Blasen; Lampe dimmt ab Takt 65; ab Takt 68 rosa Glühen von unten | keine Kick, kein Sonar (auch nicht im Fill); Riser = Glühen + Tracking-Band |
| 73–80 | Drop | Qualle schlägt ein (Pink-Flash + Chroma + Glitch auf 132,98), Boot wird zur Seite gedrückt, Lampe aus | Kick = Glocke kontrahiert + Druckwellen-Ring; Tentakel laufen dem Puls nach; Tears jeden 4. Takt |
| 81–88 | Drop | Zwei kleine Quallen kommen dazu, pulsen auf dem Offbeat | Tears auf jedem Takt |
| 89–96 | Drop | wie oben | Tears auf jedem Takt, stärker |
| 97–104 | Schluss | Brut steigt weg, Qualle hebt sich, verlässt in Takt 103–104 das Bild; letztes Bild = Boot allein in der Leere | Tears wieder jeden 4. Takt |

Technik: Wasser als fünf Hintergrundplatten (Aqua, Blau, Indigo, Purple, Midnight) in gewellten
Tonstufen, Mischung über die Tiefe (flach → mittel → tief). Alles Helle (Sonne, Korallen, Boot, Ringe,
Blasen, Schwebeteilchen, Tentakel) wird aus allen Hintergrundplatten auf Papier geknockt und dann
gedruckt. Blau liegt auf demselben Rasterwinkel wie Aqua: auf verschiedenen Winkeln erzeugten die
beiden ein grobes Rautenmoiré (per Test belegt: Aqua allein sauber, ohne VHS weiterhin Moiré).

## Geprüft

- `verify.mjs` (Chromium): seek rein über die ganze Länge, Vertrag hält.
- Kontaktbögen bei 1–192 s angesehen, 1:1-Bilder bei 50, 95 und 150 s.
- Frame-Streifen 132,87–133,17 s: Flash und Glitch sitzen auf dem Einschlag-Frame.
- `out/dense-motherfutz-0-30.mp4`: 0–30 s, 900 Frames, 1080², AAC-Ton aus `track.wav`. Gerendert
  in drei parallelen 10-s-Stücken, per ffmpeg verkettet und gemuxt.
- Nicht geprüft: Timing mit Ton durch mich (ich kann das Video nicht abspielen), 30–192 s als Video.

## Änderungen

- 2026-09-25 (Nutzer): Sonar nur noch auf der 1 jedes Takts und langsamer: 250 px/s statt 520,
  Lebensdauer 1,6 Takte, so überlappen immer zwei Ringe. Die Druckwellen der Qualle im Drop
  bleiben auf jeder Kick.

## Nächste Runde (Nutzer-Feedback 2026-09-26; umgesetzt, siehe „Runde 2“)

Umfang: **nur Takt 1–72 (bis zum Drop)** überarbeiten und rendern; Drop und Schluss bleiben.

1. **Sonar auf die 2,5:** Ping auf der Achtel nach Schlag 2 jedes Takts
   (`T(bar) + 1.5 * BEAT`), nicht mehr auf der 1. Eigene Ping-Liste statt `k.down` in `rings()`.
2. **Zwei Stellen werden für mehrere Sekunden fast schwarz**: die erste um 0:49 (≈ Takt 27), die
   zweite später. Ursache unbekannt. Erst messen: Kontaktbogen 46–54 s im Abstand von 0,5 s, dann
   die zweite Stelle suchen (Kontaktbogen über 30–133 s im Abstand von 2 s). Verdacht erst danach.
3. **Lichtschächte fest an der Oberfläche/Welt**, sie dürfen nicht mit dem Boot mitwandern:
   `shafts()` hängt an `st.surf`/Bildschirm, muss an Welt-y (Scroll) gebunden werden und mit der
   Tiefe ausblenden.
4. **Dramaturgie bis zum Drop:** Das Meer wird immer dunkler, aber die Unterwasserwelt wird
   dabei immer mystischer und leuchtender. Es kommen immer mehr Fischschwärme in fantastischen
   Formen und Leuchtfarben (Fluo auf Papier geknockt, nicht dunkle Silhouetten). Vor dem Drop
   kurz ganz dunkel, die Bootslampe fällt flackernd aus. Dann kommt die Qualle.
5. **Probe-Renders in niedriger Auflösung** (vom Nutzer gewünscht, gern unter 720). Es reicht
   nicht, bei `render.mjs --size` nur den Screenshot zu verkleinern: gezeichnet wird weiter in
   1080, und das verkleinerte Raster erzeugt Moiré. Nötig ist eine echte Zeichen-Skalierung in
   der Film-HTML, etwa ein Query-Parameter, der `OUT` bzw. `K` und alle festen 1080-Annahmen
   (`fastBandPass`, `vhs`, `inkPass`-Scratch) mitskaliert. Sonst eine eigene Preview-Option im
   Tool, aber nur nach Rückfrage (`tools/`).

## Runde 2 (2026-09-26): umgesetzt für Takt 1–72 (Blackout und Verscheuchen durch Runde 3 ersetzt)

1. **Sonar auf der 2,5:** eigene Liste `PINGS` (`T(bar) + 1.5 * BEAT`, Takte 1–60), `rings()` liest
   Ping- statt Kick-Liste. Die Druckwellen der Qualle bleiben auf jeder Kick des Drops.
2. **Die dunklen Stellen waren ein Render-Artefakt, keine Szene.** Gemessen (mittlere Helligkeit
   des alten `out/dense-motherfutz.mp4` alle 0,5 s): hell bis 48,5 s, ab 49,0 s Luma ~20 bis 64,0 s,
   ebenso 80,5–96,0 und 115–128 s. Alle drei Strecken enden exakt an einer 32-s-Stückgrenze (64, 96,
   128), ein dunkles Bild zeigt die Tinten ohne Papier auf dem Seitenhintergrund. `seek()`-Stills
   derselben Zeiten sind hell, und ein Einzelprozess über 720 Frames ab 32 s blieb hell, ohne
   `contextlost`. **Hypothese (nicht belegt):** Bei drei parallelen 1080-Prozessen verliert Chromium
   unter Speicherdruck die GPU-Canvases, und das einmal gebackene Papier bleibt leer bis zum
   Prozessende. Abhilfe: Papier liegt als `ImageData` im JS-Speicher und wird pro Frame per
   `putImageData` gesetzt; Rasterkacheln werden bei verlorenem Kontext neu gebaut. Beim nächsten
   Voll-Render die Luma-Messung wiederholen:
   `ffmpeg -i x.mp4 -vf "fps=2,scale=64:64,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-" -an -f null -`
3. **Lichtschächte in Weltkoordinaten:** sie hängen an `st.surf`, reichen `SHAFT_LEN` = 1800 px in die
   Tiefe und heben das Wasser in sechs Tiefenscheiben immer weniger an. Sie scrollen mit dem Abstieg
   weg (ab ~42 s aus dem Bild).
4. **Dramaturgie bis zum Drop** (nach Nutzer-Idee: Schwarm wie in `reference/films/roost`):
   - Das Meer dunkelt durchgehend: `dm` 0 → 0,45 (Groove 1) → 0,8 (Groove 2) → 1 (Übergang) → 1,35
     (Breakdown, neue vierte Wasserstufe „Abyss“) → 1,75 in Takt 72. Drop und Schluss bleiben bei 1.
   - Dunkle Silhouetten-Schwärme nur noch in Groove 1 (Takt 17, 25, 33).
   - **Biolumineszenter Schwarm** (`schoolAt`): 1500 Fische auf einer dünnen, sich verwindenden
     Fläche (Modell aus roost: Twist, Biegung, Lappen, alles analytisch in t). 16 Gruppen schwimmen ab
     Takt 41 von den Seiten ein und schließen sich von der Mitte her an (bis ~Takt 64). Jeder Fisch
     ist ein kurzer Strich in Schwimmrichtung, aus allen Wasserplatten geknockt und in Aqua gedruckt;
     Rückgrat Sunflower, Enden Pink. Zwei Hof-Bänder heben das Wasser um die Fische an (Glow). Kick:
     Schwarm zuckt zusammen. Takt 65–66: Schwarm wird zum geneigten Ring ums Boot, ab Takt 68 dreht
     der Riser ihn schneller.
   - **Blackout:** ab Takt 71, Schlag 3 gehen die Lichter wellenweise und stotternd aus (bis ~131,5 s),
     die Lampe flackert in Takt 72, Schlag 1–2 aus, das Boot wird zum Schatten. Von ~132,0 bis
     133,0 s ist es fast ganz dunkel. Das rosa Riser-Glühen von unten und das Aufsteigen der Qualle im
     Fill sind entfernt; die Qualle erscheint erst auf 133,0.
   - **Verscheuchen:** Auf dem Einschlag leuchten die Fische wieder auf und stieben radial von der
     Qualle weg, über zwei Takte (73–74). Das ist die einzige Änderung im Drop.
5. **Probe-Renders in niedriger Auflösung:** `index.html?res=540` zeichnet nativ in 540 (K = res/1080).
   Layout bleibt in 1080-Koordinaten; Pixelarbeit (Raster, Scratch-Platten, `fastBandPass`, `vhs`,
   Registerversatz) läuft in OUT. Rasterweite `max(4, 4,6·K)`: bei 3 px gab es zu wenige Tonstufen,
   das Wasser zerfiel in Stufen. Mit 4 px stimmt der Ton mit 1080 überein, die Punkte sind relativ
   gröber. Render mit Ton: `probe.mjs` im Filmordner (aus `tools/` starten, `tools/` bleibt unverändert):
   `node ../films/dense-motherfutz/probe.mjs --from 0 --to 137 --res 540 --jobs 3`
   → `out/dense-motherfutz-probe-0-137-540.mp4`. Stills: `shoot.mjs … --size 540 --query res=540`.

Geprüft in Runde 2:
- `verify.mjs` (Chromium): seek rein, Vertrag hält.
- Stills 540 und 1080 bei 5–134,5 s, 1:1-Ausschnitte bei 100 und 112 s.
- Probe `out/dense-motherfutz-probe-0-137-540.mp4`: 137,00 s, 540², 30 fps, AAC 48 kHz; 726 s mit drei
  Prozessen (~0,35 s/Frame pro Prozess). Mittlere Helligkeit alle 0,5 s: 114 im Intro, 139 bei 28 s
  (Flachwasser), fällt stetig auf 99 (72 s), 89 (90 s), 59 (Breakdown), 43 bei 132–132,5 s (Blackout),
  79–85 ab 133,0 (Drop). Keine Einbrüche.
- Nicht geprüft: Timing mit Ton (ich kann das Video nicht abspielen); ob der Schwarm in Bewegung als
  Schwarm liest, habe ich nur auf Einzelbildern gesehen.

Nebenbei gefunden und behoben:
- Harte Horizontlinie im Wasser (z. B. 100 s, y ≈ 540) trotz nur 2/255 Deckungsunterschied: Viele
  Pixel einer Rasterkachel teilen denselben Schwellwert, deshalb kippt ein Ring pro Punkt auf einmal.
  `fastBandPass` hat jetzt ein festes, leinwandverankertes Schwellen-Jitter von ±4 Stufen (`JIT`). Dazu
  10 statt 6 Wasserstreifen.
- Lampenkegel druckte im Tiefwasser braun (Sunflower über Überdruck): die fernen Bänder blenden mit der
  Tiefe aus. Die Lampe dimmt ab Takt 65 nicht mehr, sie fällt erst in Takt 72 aus.

## Runde 3 (2026-09-26, Nutzer-Feedback auf den Probe): ganzer Film (Schluss ab Takt 97 durch Runde 7 ersetzt)

Ersetzt Blackout und Verscheuchen aus Runde 2 und den alten Drop/Schluss.

- **Sonar nur im Wasser:** `rings()` clippt die Pings auf `belowSurface` (sichtbar im Intro).
- **Kein Schwarz vor dem Drop:** Lichter, Lampe und Boot bleiben an; der Ring um das Boot leuchtet bis
  133,0. `dm` endet im Breakdown bei 1,35 (kein Absacken in Takt 72).
- **Einschwimmen auf den Beat, organisch:** Pro Takt startet ab Takt 41 eine Gruppe auf dem Downbeat
  (16 Gruppen, Mitte zuerst, bis Takt 58). Der Fortschritt läuft auf `pulseProg` (Zeit, die auf jeder Kick
  schneller läuft, tabelliert wie `SCROLL`), also schwimmt die Gruppe in Schüben auf der Kick. Jede Gruppe
  kommt von einem eigenen Punkt rings um das Bild (Goldener Winkel) auf einer Bézier-Kurve, deren Ende der
  lebende Platz auf der Fläche ist. Jeder Fisch hängt um `SLAG` hinterher, dadurch zieht die Gruppe als
  Band ein und fließt in den Schwarm, statt seitlich „anzukleben“.
- **Einzelwesen beim Abtauchen:**
  - Manta, Takt 21–28: dunkle Silhouette im Flachwasser, Flügelschlag über zwei Takte, Bass vergrößert ihn.
  - Anglerfisch, Takt 45–52 (seit Runde 6: Takt 29–45, siehe dort): lauert von rechts, Maul auf und zu, Zähne auf Papier. Die Sunflower-Angel
    pulsiert auf der Kick und flammt auf jedem Downbeat auf.
  - Staatsqualle (Siphonophore), Takt 55–62: Perlenkette in Aqua/Pink schlängelt quer durchs Bild, auf
    jedem Schlag läuft eine Lichtwelle vom Kopf die Kette hinunter.
  - Rippenquallen, Takt 61–71: drei durchscheinende Körper, Kammreihen in Aqua/Pink/Sunflower, das Licht
    läuft die Reihen hinunter, schneller mit den Höhen.
- **Drop und Schluss (neu):**
  - 133,0: Pink-Flash, die Qualle schießt mit 20 % Größe von unten in den Ring.
  - Takt 73–92: Sie jagt den Schwarm (der auf einer Schleife flieht, die Qualle folgt ihr mit 1,4 s
    Verzug und stößt auf jede Kick vor). Um die Qualle öffnet sich eine Lücke im Schwarm. Auf jedem
    Downbeat von Takt 74 bis 96 lösen sich Fische und stieben davon, bis der Schwarm weg ist.
  - Wachstum: +10 Prozentpunkte auf dem Downbeat jedes vierten Takts (77, 81, 85, 89, 93, 97:
    20 → 80 %), mit kurzem Nachfedern (`settle`). „10 %“ als Prozentpunkte gelesen; ×1,1 alle vier Takte
    hätte am Ende nur ~35 % ergeben.
  - Takt 93–96: Die Qualle wendet sich dem Boot zu und richtet sich auf; Takt 97 (177,3 s) schließt
    sich die Glocke um das Boot.
  - Takt 97–98: Kamera fliegt mit hinein. `CAM` (Zoom 1 → 12 um die Bootsposition) wirkt auf alle
    Platten; das Boot und sein Lampenkegel werden in Bildschirmkoordinaten gezeichnet und behalten ihre
    Größe. Raster bleiben an der Leinwand, der Zoom lässt die Punkte nicht mitwachsen.
  - Takt 99–104: im Inneren der Glocke. Pinkes Gewebe mit violettem Rand, acht Radialkanäle und
    Ringkanal in Florange, vier Gonaden in Sunflower auf Papier, 120 verschluckte Fische kreisen, das
    Boot schwebt mit Lampe in der Mitte. Die Wände ziehen sich auf jeder Kick zusammen. Das Innere
    öffnet sich aus dem Zoom (startet 2,6× zu groß und bremst über Takt 99 ab).
  - Die zwei kleinen Quallen ab Takt 81 und das Wegsteigen der Qualle sind entfernt.
- **Alter Fehler behoben:** `jellyRim` schaltete mitten im Band auf `source-over` und radierte das
  0,55-Pink der Glocke weg: Die Glocke war innen immer Papier. Jetzt ein Even-odd-Ring ohne Compositing.

Geprüft in Runde 3: `verify.mjs` grün; Kontaktbögen 3–190 s in 540. Probe
`out/dense-motherfutz-probe-0-192-540.mp4`: 192,00 s, 540², 30 fps, AAC; 2211 s mit drei Prozessen. Helligkeit
um den Drop 58–62 (kein Schwarz mehr), Inneres ab 181 s bei ~125. Nicht geprüft: Timing mit Ton, Bewegung
nur auf Einzelbildern gesehen.

## Runde 4 (2026-09-26): Look wie die Referenz, 9:16

Referenz ist das ChatGPT-Triptychon (Konzept 5), Ziel: „flashiger, weniger kindlich, Farben poppen“.
- **Format 9:16** (1080 × 1920), `?aspect=1:1` für das Quadrat. Layout in logischen px (`W`, `H`), Pixelarbeit
  in `OUTW × OUTH`. Senkrechte Positionen skalieren mit `YS = H / W`. Stills und Video über `probe.mjs` (liest
  die nativen Canvas-Pixel; `shoot.mjs`/`render.mjs` haben ein quadratisches Fenster und würden beschneiden).
- **Verläufe statt Stufen:** `fastBandPass` nimmt neue Bandarten `{ lift }` (hellt um den Anteil auf) und
  `{ over }` (dunkelt ohne Löschen). Die Füllfarbe darf ein Alpha-Verlauf sein. Wasser, Oberflächenlicht,
  Lichtstrahlen, Lampenkegel und alle Glows sind jetzt gerasterte Verläufe. `JIT` ±34 statt ±4 macht Korn.
- **Farben:** Flachwasser Aqua + Blau (oben hell, unten satt), Tiefe Blau + Indigo + Purple (Ultramarin/Violett),
  Midnight fast ganz raus. VHS als „übersteuerte Überspielung“: `sat` 1,5, `contrast` 1,2, Scanlines 0,1.
- **Konfetti-Korn:** ~7500 Punkte in Aqua, Pink, Sunflower, Papierweiß und Dunkel, an die Welt gebunden (drei
  Parallaxen), funkeln, flackern mit den Hats.
- **Kleines dunkles U-Boot:** Rumpf dunkel überdruckt, Aqua-Randlicht, Kuppelfenster, Florange-Streifen,
  Lampe in der Nase mit weichem und hartem Kegel als Verlauf plus Florange-Glut an der Quelle.
- **Sonar:** Pakete aus vier dünnen weißen Strichringen pro Ping.
- **Fische:** 38 realistische Silhouetten (Rumpf, Gabelschwanz, Rücken- und Brustflosse) in verschiedenen
  Tiefen, Takt 13–44, zucken auf der Kick. Die alten Ellipsen-Schwärme sind raus.
- **Riff:** Äste, Seefächer und Hirnkorallen in vier Inks, Spitzen leuchten Sunflower.
- **Qualle:** stärkeres Magenta (Glocke 0,72, Randschatten), Magenta-Bloom, Sunflower-Randlicht über Pink
  (druckt orange), 20 lange Tentakel mit Florange-Glanzlinien.
- **VHS:** dünne helle Dropout-Linien mit Chroma-Versatz quer durchs Bild, langsam wandernd.

Geprüft in Runde 4:
- `verify.mjs` grün nach dem 9:16-Umbau (nicht erneut nach den letzten Farbwerten).
- Stills in 1080×1920 bei 3–187 s angesehen, nach jedem Farbschritt; an den Nutzer geschickt.
- `out/dense-motherfutz-probe-0-30-180.mp4` (180×320, 45 s Renderzeit) und
  `out/dense-motherfutz-probe-0-30-1080.mp4` (1080×1920, 30,00 s, 609 s mit drei Prozessen, ~2 s/Frame pro
  Prozess, 242 MB bei 64 Mbit/s: das Korn frisst Bitrate).
- `out/dense-motherfutz-probe-0-192-540.mp4`: 540×960, 192,00 s, AAC, 1758 s mit drei Prozessen, 474 MB.
  Helligkeit alle 2 s: Intro ~114, Flachwasser bis 120, fällt stetig auf ~55 (Breakdown und Drop),
  Inneres ~106. Keine Aussetzer.
- Nicht geprüft: Bewegung und Timing mit Ton (ich kann das Video nicht abspielen).

Bekannte Fehler / offen aus Runde 4:
- **Drop-Blitz dunkelt statt aufzuhellen:** Auf dem Einschlag-Frame 133,00 s fällt die Helligkeit auf 44
  (Umgebung 54). Der Pink-Flash druckt Pink über die dunkle Tiefe. Fix-Idee: zuerst Papier freilegen
  (Lift über alle Platten), dann Pink darüber.
- Qualle noch eher flach gezeichnet (Referenz: malerisch, fleckige Struktur); Manta und Anglerfisch
  reine Silhouetten; das Innere am Schluss sehr grafisch.
- Voll-Render 1080×1920 steht aus (geschätzt ~65 min mit drei Prozessen).

## Runde 5 (2026-09-28): zurück zum Druck, nach reference/films/roost

Nutzer: roost sieht schöner aus. Befund aus dem Quellvergleich (nicht die Auflösung): roost hat kein VHS,
nur vier Inks mit Überdruck-Mischtönen, eine Lichtquelle mit klarer Helligkeitsordnung, organisch
gewachsene Formen und Korn aus dem Raster statt aus Rauschen. Umgesetzt:
- **Vier Inks:** Blau, Indigo, Pink, Sunflower. Das Meer liegt auf Blau + Indigo, Pink macht die Tiefe violett
  und die Dämmerung lila, Orange ist Pink über Sunflower (Riff, Qualle, Kanäle im Inneren, Lampenglut).
  Aqua, Purple, Midnight und Florange sind raus. Blaue Schwarmfische drucken als helle Tönung (0,42).
- **VHS nur noch als Hauch:** Chroma 0,6, Rauschen 0,02, Scanlines 0,03, keine Sättigung/Kontrast-Übersteuerung.
  Dropout-Linien und Tears nur im Drop.
- **Kein Konfetti:** nur ~750 papierweiße Schwebeteilchen. `JIT` wieder ±8.
- **Lampenkegel:** Gelb nur im heißen Kern; der weiche Kegel hebt nur das Wasser an (Gelb über Blau druckte grün).
- **Formen mit Hand:** Fischsilhouetten leicht unregelmäßig geschnitten (`makeWob` pro Fisch, fest in der Zeit),
  Manta mit konvexer Vorderkante, spitzen Flügeln und konkaver Hinterkante, Glockenrand mit ungleich tiefen Bögen.

Geprüft: `verify.mjs` grün; Stills in 1080×1920 bei 3–187 s. Nicht geprüft: Bewegung, Ton.

Renders Runde 5:
- `out/dense-motherfutz-probe-15-30-1080.mp4`: 15–30 s, 1080×1920, 256 s mit drei Prozessen. Vom Nutzer
  angesehen: „sieht schon viel besser aus“.
- **`out/dense-motherfutz-9x16.mp4`**: ganzer Film, 1080×1920, 30 fps, 192,00 s, H.264 + AAC 48 kHz,
  1,35 GB (56 Mbit/s, das Raster frisst Bitrate). 13 088 s Laufzeit, davon ~2,8 h Stillstand zwischen
  Frame 601 und 901 von Job 0 (vermutlich Rechner im Ruhezustand); die Datei ist trotzdem vollständig.
  Helligkeit jede Sekunde: gleichmäßig von 142 (Intro) über 150 (Flachwasser) auf ~75–84 (Breakdown und
  Drop), Sprünge nur 179–182 s (Flug ins Innere der Qualle, gewollt), Inneres ~111. Keine Aussetzer.

## Runde 6 (2026-09-29): Anglerfisch früher, jagt das Boot auf einem Mitten-Stab

Nutzer: Der Anglerfisch soll deutlich früher kommen, mit dem U-Boot interagieren und die lange ruhige
Strecke davor aufbrechen; die Interaktion auf Peaks in den (eher mittleren) Frequenzen.

**Gemessen** (STFT aus `track.wav`, Bänder 300–600 / 600–1200 / 1200–2400 / 2400–4800 und 350–1000 Hz,
Pegel pro Sechzehntel auf dem Takt-Raster): Im Band 350–1000 Hz sitzt ein Stab auf **Schlag 2 jedes
vierten Takts** (Takte 9, 13, 17, 21, … 41), ab Takt 43 jeden zweiten Takt. Abstand zum Mittel der
anderen Schläge: Takt 29 +2,2 dB, 33 +6,4, 37 +6,2, 41 +5,2, 43 +2,4. Onset liegt 10–14 ms vor dem
Rasterschlag, also auf dem Frame. `M.*` hat dafür kein eigenes Signal (`mid` ist 800–2500 Hz und von der
Kick überdeckt), deshalb stehen die Zeiten wie die Kicks als Raster-Liste `ANG` in `index.html`.
Nicht gegengehört: welches Instrument das ist.

**Szene, Takt 29–45 (51,7–82,2 s)**, vorher Takt 45–52:
| Stab | Zeit | Bild |
|---|---|---|
| Takt 29 | 52,21 | Angel zündet am rechten Rand; der Fisch schiebt sich auf der Kick heran (`pulseProg`), ins Lampenlicht |
| Takt 33 | 59,59 | 1. Biss: Maul reißt über den Schlag davor auf, schnappt auf dem Stab zu; Boot weicht nach links oben aus, Lampe stottert 0,6 s |
| Takt 37 | 66,98 | 2. Biss von rechts oben, streift das Boot: es wird nach unten gedrückt und trudelt, Lampe stottert 1 s |
| Takt 41 | 74,36 | Boot dreht die Lampe über zwei Schläge auf den Fisch und blendet ihn: runder Licht-Ausbruch, Fisch als Silhouette, fliegt zurück, Angel erlischt |
| Takt 43 | 78,05 | Angel flackert wieder an, letzter Schnapper ins Leere, dann sinkt er nach rechts unten weg (bis Takt 45) |

Technik: Fisch 1,35× größer, mit Neigung (`rot`) und Schwanzschlag; Posen als Keyframe-Liste `AP`,
Boot-Ausweichen in `subDodge()` (wirkt in `subAt`, also folgen Blasen und Lampe). Der Fisch druckt nach
den Lampen-Bändern, bleibt also auch im Kegel Silhouette, und ist aus dem gelben Lampenkegel geknockt
(Gelb über Blau druckte grün).

Geprüft: `verify.mjs` grün; Stills 540 bei 52–81,5 s und um jeden Stab angesehen.
Nicht geprüft: Timing mit Ton (ich kann das Video nicht abspielen).

## Runde 7 (2026-10-01): neues Ende „Der Größere“

Nutzer: Das Ende „die Qualle frisst das U-Boot und wir fliegen mit in den Mund“ sieht schlecht aus. Vier
Enden wurden parallel als Varianten gebaut (je eine Kopie in `films/_end-*`, 540er-Probe 165–192 s mit Ton):
Implosion, Der Größere, Der letzte Ping, Grund erreicht. Gewählt: **Der Größere**. Flug ins Innere und
Innenraum (`interiorPlates`, `innerFish`, Kanäle, Gonaden) sind entfernt.

| Zeit | Bild |
|---|---|
| Takt 93–96 (169,90–177,28) | unverändert: Qualle wendet sich dem Boot zu, Glocke schließt sich auf Takt 97 |
| ab Takt 97, Schlag 2 | Kamera zieht zurück (`levCam`, Zoom 1 → 0,26 bis Takt 103, auf der Kick getaktet). Qualle und Boot schrumpfen; die Qualle hängt an einer Angel, ein Lichtpaket läuft auf jeder Kick die Angel hinunter |
| Takt 98–102 | der Riese taucht als dunkler Überdruck der drei Meerplatten auf: Zähne auf Papier, Kiefer klafft auf der Kick, Rückenstacheln, Hautnähte, Kiemen; zwei Reihen Flankenorgane gehen einzeln auf der Kick an (Pink/Sunflower) |
| Takt 104 (190,21) | das Auge öffnet sich über einen Schlag (Iris Sunflower mit Pink-Ring = orange, dunkle Pupille, Glanzlicht), Blitz und VHS-Tear; harter Schluss bei 192,00 |

Code: Block `LV` (Geometrie im Koordinatensystem des Endbilds, per `levG` an die Qualle gehängt), `levSway`,
`levCam`, `levAt`, `levBands` (Meerplatten), `drawLev` (Tinten). Boot und Lampe skalieren mit `st.zk`; `water()`
und die Schwebeteilchen liegen im Zoom-Out im Bildschirmraum.

Geprüft:
- Stills der übernommenen Fassung bytegleich mit der Variante bei 150–191,8 s.
- Bei 150 und 170 s bytegleich mit dem Stand vorher, die 1080er-Stücke 0–48 s bleiben gültig.
- `verify.mjs` grün (2 von 3 Läufen; ein Lauf meldete „t=0 not repeatable“ in unverändertem Code, wie zwei
  Agenten unter Last an anderen Stellen; vermutlich Last/GPU, nicht belegt).
- Probe-Video der Variante vom Nutzer angesehen.

Offen laut Agent: Unterkiefer dunkel auf dunkel, Zähne erscheinen um 180,6 s etwas vor dem Körper,
Rückenstacheln großteils außerhalb, Lidkontur leicht eckig.

Hinweis: Takt 93 beginnt bei 169,90 s (nicht 171,66 s, wie in der Variantenvorgabe verrechnet).

## Voll-Render (2026-09-26, erste Fassung, 1:1; veraltet)

`out/dense-motherfutz.mp4`: 192,00 s, 5760 Frames, 1080², H.264 + AAC. In sechs 32-s-Stücken
gerendert, per ffmpeg verkettet und mit `track.wav` gemuxt. Sechs parallele Prozesse liefen auf
diesem Rechner (i5-1135G7, 16 GB) in „Out of memory“ bei ImageData; mit wiederverwendetem
Plattenpuffer und drei Prozessen liefen die Stücke durch (~18 min pro 32 s bei drei parallel).
Ton: −8,8 LUFS, True Peak +4,7 dBFS im MP4. Schon die Quelle `track.wav` hat +1,3 dBFS True Peak,
AAC hebt das weiter an. Der Master ist nicht angefasst.

## Render-Kosten

Erster Voll-Render brach nach ~1 h bei Frame 2041 ohne Meldung ab (Exit 4, Ursache unbekannt), bei
~1,8 s/Frame. Gemessen: `bandPass` war 70–90 % der Zeit (pro Band mehrere Vollbild-Composites).
`fastBandPass` rastert jetzt eine Deckungskarte pro Platte in einem Pixel-Durchlauf (gleiche
Rasterkachel wie `screenCoverage`, aber stufenlos statt in 1/16-Schritten). Kleine Pässe bleiben
bei `inkPass`, leere Pässe werden übersprungen. Stand: ~1,2–1,6 s Zeichnen + ~0,9 s Screenshot pro
Frame; drei parallele Prozesse brauchen ~14 min für 30 s Film. Der volle Film läuft deshalb in
Stücken, nicht in einem Prozess.

## Schwächen / nächste Schritte

(Stand erste Fassung; Halo, Glockeninnenseite und Schwärme sind in Runde 2–4 überarbeitet.)
- Intro A steht 15 s fast still (nur Ringe, sinkende Sonne).
- Kein Snare-Einsatz: der Detektor liefert keinen sauberen Backbeat (Treffer auf Achteln verteilt).

## Offen

- Gegen das Gehör prüfen: Drop auf 133,0? Gruppe ab Takt 41 wirklich ein neues Element?
