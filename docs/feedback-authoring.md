# Feedback schrijven

Volg eerst `shared/grammar-core/docs/feedback-authoring.md`. Tot de volgende core-sync vervangt de lokale regel hieronder de verouderde formulering over `diagnose` in die subtree.

## Lokale mapping

- `primaryMisconception` kiest het herstelpad.
- Een foutcode toont welk antwoordpatroon optrad; zij bewijst geen precieze leerlinggedachte.
- Gebruik standaard een korte `herstelvraag` en één `herprobeer`-actie.
- `redenering` bevat alleen de regel die voor dit onderscheid nodig is.
- Het legacyveld `diagnose` benoemt uitsluitend een werkelijk herkend antwoordpatroon of anders een neutraal grammaticaal contrast.
- `sleutelwoord` is één woord uit de herstelvraag zolang de huidige uitklap-UI dat vereist.

## Controle

- grammaticaal juist, ook bij v/z-wisseling, inversie en adjectivische verbuiging
- geen absolute formulering met bekende uitzonderingen
- functiecheck vóór spellingregel
- direct toepasbaar op het huidige item
- alle ingebouwde entries door `validateRichFeedback`

Maak alleen een nieuwe misconceptiecode als het herstelpad werkelijk anders is.
