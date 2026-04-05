# Stam en stamafleiding

## Doel
Dit document beschrijft hoe Werkwoordlab de stam van een werkwoord afleidt.

Deze lokale uitleg moet congrueren met:
- `shared/grammar-core/docs/werkwoordspellingsalgoritme.md`
- `docs/reference-layer-usage.md`

## Kernonderscheid
Werkwoordlab gebruikt twee stamrepresentaties:

1. **ruwe stam**
2. **orthografische stam**

Dat onderscheid is verplicht, omdat niet alle beslissingen op dezelfde stam mogen worden gebaseerd.

## Ruwe stam
De ruwe stam ontstaat direct uit de infinitief, vóór zichtbare spellingnormalisatie.

Hoofdregel:
- gewone infinitief: trek `-en` af
- `-iën`-werkwoord: trek alleen `-n` af

Voorbeelden:
- `maken -> mak`
- `leven -> lev`
- `lozen -> loz`
- `ruziën -> ruzië`

## Orthografische stam
De orthografische stam is de zichtbare stam die je gebruikt in vervoegde vormen.

### Regel 1 - behoud lange klinker
Een lange klinker in de infinitief moet in de stam lang blijven.

Voorbeelden:
- `maken -> maak`
- `horen -> hoor`
- `weten -> weet`

### Regel 2 - geen dubbele eindmedeklinker
Een stam eindigt niet op twee gelijke medeklinkers.

Voorbeelden:
- `pakken -> pak`
- `missen -> mis`
- `wennen -> wen`

### Regel 3 - geen eind-v of eind-z
Een orthografische stam eindigt niet op `v` of `z`.

Voorbeelden:
- `leven -> leef`
- `lozen -> loos`
- `durven -> durf`

### Regel 4 - `-iën`-werkwoorden eindigen op `ie`
Voorbeelden:
- `ruziën -> ruzie`
- `skiën -> skie`
- `oliën -> olie`

## Werkafspraak voor de repo
- gebruik de **ruwe stam** voor beslissingen over `d/t`
- gebruik de **orthografische stam** voor zichtbare TT-, VT- en VD-vormen
- gebruik nooit alleen de zichtbare stam voor alle regels

## Machineleesbare bron
De bijbehorende lokale runtimebron is:
- `content/reference/stem-rules.nl.json`
