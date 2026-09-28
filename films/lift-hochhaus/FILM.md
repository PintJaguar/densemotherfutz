# Lift / Hochhaus — Dense Motherfutz, Strang 2

**Eigenständiges Projekt**, getrennt vom U-Boot-Film `films/dense-motherfutz/` (Tiefsee-Abstieg).
Beide teilen nur den Track und die Rasteranalyse; Code, Engine, Look und Renders sind getrennt
(`out/lift-*`). Nichts hier ändert den U-Boot-Film und umgekehrt.

Zweiter, eigenständiger Film zum selben Track (`track.wav`, 192,00 s, 104 Takte, 130,00 BPM, Takt 1
bei 0,054 s; Analyse und Rasterbefund aus `../dense-motherfutz/FILM.md` übernommen, `features.*`
kopiert). 9:16 (1080 × 1920), `?aspect=1:1` für das Quadrat, `?res=540` für native Probes.

Idee (vom Nutzer): Jede Etage ist eine eigene Szene. Kick = Etagenzähler springt eins weiter; Hats =
Lichtstreifen an der Türritze; Build = der Aufzug beschleunigt, die Etagen werden zu Schlieren;
Drop = die Türen öffnen sich zum Dach mit Skyline und Sonne; Breakdown = Stromausfall, nur rosa
Notlicht.

## Aufbau (Schnitte auf Taktanfängen)

| Takte | Zeit (s) | Einstellung | Bild | Musik → Bild |
|---|---|---|---|---|
| 1–8 | 0–14,8 | Kabine total | Zwei Leuchtröhren stottern an, Kamera schiebt langsam zur Tür | Kick: Zähler +1 (0 → 32), Lichtband läuft die Türritze herunter, Kamera-Ruck; Hats: dünne Streifen in der Ritze |
| 9–16 | 14,8–29,6 | Halt: **Büro** (32) | Tür geht auf, dunkles Großraumbüro, Fensterwand mit Nachtstadt | Kick: nächste Reihe Deckenpaneele geht an (nah → fern), Monitore darunter fahren hoch; danach läuft auf jeder Kick ein Lichtpuls die Reihen hinab; Low-Mids: Balkengrafik auf den Monitoren; Takt 16 (Build): Paneele stottern, Tür schließt |
| 17–20 | 29,6–37,0 | Nah: **Zähler** | Siebensegment-Anzeige formatfüllend | Kick: Zahl +1 (33 → 48), Zoom-Punch, Glimmen |
| 21–28 | 37,0–51,7 | Halt: **Club** (48) | LED-Tanzfläche, Crowd als Silhouetten vor glühender LED-Wand, DJ, Discokugel, Laser | Kick: Bodenmuster wechselt, Crowd geht in die Knie, LED-Wand feuert einen neuen Rahmen; Hats: Laser flackern; Claps (2 und 4): Stroboskop, Laser werden gold |
| 29–32 | 51,7–59,1 | **Schacht** nach oben | Tunnel aus Lichtringen (Pink/Aqua/Gold), Landungstüren mit Lichtspalten, Gegengewicht rauscht in Takt 31 vorbei | Kick: der Aufzug springt eine Etage (49 → 64), die Ringe pumpen heran |
| 33–40 | 59,1–73,9 | Halt: **Aquarium** (64) | Acryltunnel durch ein Becken, Kelp, Korallen, Lichtstrahlen, Kaustik | Kick: Schwarm um den Tunnel zuckt zusammen; Bass: Kelp schwingt; Höhen: Kaustik; Hats: Blasen; Claps: Quallen pulsen; Manta fliegt Takt 35–38 über uns hinweg, Hai quert Takt 39–40 |
| 41–44 | 73,9–81,3 | Nah: **Türritze** | Dunkler gebürsteter Stahl, senkrechte Lichtlinie | Kick: farbiger Lichtbalken läuft über beide Flügel (Stahlschliff zieht Licht waagerecht), Hats: weiße Blitze, anamorphe Streifen, Staub im Streiflicht |
| 45–52 | 81,3–96,1 | Halt: **Dschungel** (80) | Zugewachsene Büroetage, Laubwände, Pfad zu einem Lichtloch in der Fassade | Kick: nahe Blätter federn; Bass: Laub und Lianen schwingen; Hats: Glühwürmchen; Claps: Blüten pulsen; Augen im Dunkeln ab Takt 49 (blinzeln auf der 1), Papageien Takt 49–50 |
| 53–56 | 96,1–103,4 | Kabine, gekippt | Schnellere Fahrt, Handkamera | Kick: Zähler 81 → 96, Ritze, stärkerer Ruck |
| 57–60 | 103,4–110,8 | Halt: **leere Etage** (96) | Rohbau, Säulen, Nachtstadt hinten offen, Folie weht, eine Glühbirne pendelt (ein Zyklus pro 4 Schläge), ein verlassener Stuhl | Höhen sind raus: nichts funkelt; Kick: Birne atmet; Takt 60: Birne flackert, Tür schließt |
| 61–68 | 110,8–125,6 | **Stromausfall** | Kabine dunkel, rosa Notleuchte an der Decke, Staub im Licht, Zähler „--“; Kamera schiebt langsam zum toten Zähler | Kein Kick; Notlicht atmet über zwei Takte; Ruck beim Ausfall auf der 61 |
| 69–72.2 | 125,6–132,1 | **Schacht, Rush** | Strom kommt stotternd zurück, der Aufzug beschleunigt, Ringe verschmieren zu Bändern, Bild dreht sich, oben öffnet sich rosa Himmel | Riser = Geschwindigkeit (tabelliert, 96 → ~150), Chroma und Tracking steigen |
| 72.3–72.9 | 132,1–133,0 | Kabine, **Fill** | Ritze gleißt, Röhren und Zähler stroben mit den Fill-Schlägen, Kamera zittert | Fill-Kicks (erkannte Onsets): Strobo, Glitch |
| 73–80 | 133,0–147,7 | **Dach**, Enthüllung | 133,0: Flash, Türen fliegen auf („PH“), Sonnenuntergang flutet die Kabine; Takt 77–80 fährt die Kamera durch die Tür hinaus | Kick: Streifen der Sonne öffnen sich, Puls läuft über das Neon-Raster, Fensterreihen springen (Bass) |
| 81–88 | 147,7–162,5 | Dach, Seitwärtsfahrt | Wassertank und Antenne ziehen vorbei, Suchscheinwerfer | wie oben; Beacon an der Antenne auf jeder 1; Tears jeden Takt |
| 89–96 | 162,5–177,3 | Dach, Kran hoch | Kamera steigt auf 7 m, unten öffnet sich das Stadtraster (Straßen, Lichter, fahrende Autos); Feuerwerk auf den Claps (Rakete steigt vorher auf) | Claps: Feuerwerk, alle Fenster blitzen, Scheinwerfer zucken; härtere Tears |
| 97–104 | 177,3–192,0 | Outro | Kamera sinkt und fährt zurück in die Kabine, Sonne sinkt, Takt 101–104 schließen sich die Türen, letzter Sonnenspalt verschwindet auf dem letzten Frame | Kick weiter auf dem Raster, Tears jeden 4. Takt |

Zähler: 1 pro Kick nur auf Fahrten (Kabine, Zähler, Schacht, Ritze, Rush); auf der 1 eines Halts
läutet die Ankunft (Pfeil blinkt gold, Zahl blinkt), die Etage bleibt stehen. Etagen 32/48/64/80/96
ergeben sich daraus von selbst.

## Technik

- **Neuer Maler:** Farben sind Ink-Mischungen (`{indigo: .8, purple: .6}`), 8 Inks in drei
  RGB-Deckungskarten. `paint` besitzt seinen Wert auf allen Platten (helle Motive sind damit
  automatisch aus allen dunklen Platten geknockt), `add` überdruckt (Screen), `light` nimmt Ink weg
  (Multiply). Verläufe tragen Alpha und werden zu Punktgrößen-Rampen. Ein Pixel-Durchlauf rastert
  alle Kanäle, versetzt jede Platte um ihren Registerfehler und multipliziert auf das Papier.
  Korn, Dichte-Wolken und Farbmangel-Flecken sind einmalig in die Schwellen gebacken.
- **Welt in Metern**, Ein-Punkt-Perspektive (`pj`), Near-Clipping. Kabine, Etagen und Dach liegen in
  derselben Projektion; die Etagen sind echte Räume hinter der Türebene, die Kamera fährt bei jedem
  Halt auf Kick-gepulstem Fortschritt hinein (`pulseProg`). Formen parallel zur Bildebene werden in
  Metern gezeichnet und per `planeM(z)` projiziert.
- **Kick** aus dem Raster (wie im ersten Film), **Hats** = erkannte Hi-Onsets (s ≥ 0,3),
  **Claps** = Schlag 2 und 4, wo der Detektor sie bestätigt (Takte 17–60, 73–104). Reaktionen mit
  einem halben Frame Vorlauf (`LEAD`).
- VHS zuletzt, Tears im Drop wie im ersten Film (jeder 4. Takt, ab 81 jeder Takt, 89–96 härter).
- Probe: `node ../films/lift-hochhaus/probe.mjs --from 0 --to 192 --res 540 --jobs 3`
  (aus `tools/`); Stills: `--stills 12,48 --res 540 --sheet`. Debug: `evalfilm.mjs "<expr>"`.

## Geprüft (Stand 2026-09-28)

- `verify.mjs` (Chromium) nach den letzten Änderungen: seek rein über alle Shot-Grenzen, Vertrag hält.
- Stills 540 über alle Einstellungen; 1:1-Ausschnitte in 1080: Aquarium (62 s), Dach (150 s),
  Club (44 s), Dschungel (93 s). Harte Rasterpunkte, Überdruck, Registerversatz, Rosetten im Himmel;
  Club-Crowd liest als Silhouetten mit Randlicht.
- Probe `out/lift-hochhaus-probe-0-192-540.mp4`: 192,00 s, 540 × 960, 30 fps, H.264 + AAC 48 kHz,
  1075 s mit drei Prozessen (~0,5 s/Frame/Prozess). Mittlere Helligkeit alle 4 s zwischen 48 und 92,
  keine Einbrüche (die dunkelste Stelle ist der gewollte Stromausfall). **Achtung:** Der Probe ist
  älter als die letzten Änderungen (Ende mit Blackout, Flackern in Takt 65, Farbhauch in der
  Ritzen-Nahaufnahme, langsamer Push in Takt 73–76). Das Ende ist per Stills geprüft (191,2 / 191,6 /
  191,95 s: Türen zu auf dem letzten Kick, dann Licht aus).
- Ein 1080-Frame kostet ~3 s; Voll-Render in 1080 geschätzt 1,5–2 h mit drei Prozessen.
- Nicht geprüft: Timing mit Ton durch mich (ich kann das Video nicht abspielen); Bewegung nur auf
  Einzelbildern und Frame-Streifen gesehen, nicht als Film.

## Übergabe: Stand und nächste Schritte

Alle 16 Einstellungen sind gebaut und laufen durch. Es gibt noch keinen 1080-Voll-Render.

Nächste Schritte, nach Priorität:
1. **Probe mit Ton ansehen** (`out/lift-hochhaus-probe-0-192-540.mp4`, oder neu rendern, weil
   älter als die letzten Änderungen). Gegen das Gehör prüfen: sitzen Zähler und Ritzen-Bänder auf
   der Kick, der Strobe im Club auf 2 und 4, das Aufreißen der Tür exakt auf 133,0 s?
2. **Dschungel** ist die schwächste Etage: Palmwedel sind in 1:1 grobe Dreiecke, der Boden ist
   flach, die Tiefe kommt fast nur aus der Lichtöffnung hinten. Wedel feiner (Fiederblättchen als
   schmale Blätter), Laub mit hellen und dunklen Seiten, mehr Nebel zwischen den Ebenen.
3. **Leere Etage** ist noch matt; die Glühbirne braucht einen kräftigeren warmen Lichtkegel und
   harte Säulenschatten.
4. **Intro Takt 1–8** ist ruhig (Kabine, Röhren, Zähler, Ritze). Prüfen, ob es trägt, sonst den
   Push stärker machen oder in Takt 5 auf die Zähler-Nahaufnahme schneiden.
5. **Dach im Kran (Takt 89–96):** Das Stadtraster liest eher als Bodengitter als als Stadt tief
   unten. Mehr Lichtpunkte und Häuserblöcke, weniger gleichmäßige Linien.
6. Danach der Voll-Render in 1080 über `probe.mjs --res 1080` in Stücken
   (`--from/--to`, drei Prozesse; im ersten Film liefen sechs Prozesse in „Out of memory“), dann
   Luma-Messung wie im U-Boot-FILM.md.

Dateien: `index.html` (Film; Kunst zwischen `ART BEGIN`/`ART END`, Engine davor), `probe.mjs`
(Stills und Videos in 9:16), `evalfilm.mjs` (Ausdruck im geladenen Film auswerten, zum Debuggen),
`features.*` und `track.wav` (Kopien aus dem U-Boot-Ordner).
