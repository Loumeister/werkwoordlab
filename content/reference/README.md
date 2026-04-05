# Referentiebestanden werkwoordspelling

Deze map bevat de lokale, machineleesbare implementatielaag voor Werkwoordlab.

## Precedentie
Deze map staat **onder** `shared/grammar-core/`.

Leeshierarchie:
1. shared canon in `shared/grammar-core/`
2. lokale Werkwoordlab-documenten in `docs/`
3. lokale regelbestanden in `content/reference/`
4. unit-specifieke itemdata en lexicale overrides

## Doel
De bestanden in deze map zijn bedoeld voor:
- evaluatorlogica
- contentvalidatie
- contentgeneratie
- regressietests

## Werkafspraak
- Gebruik JSON-bestanden uit deze map als runtimebron voor lokale Werkwoordlab-regels.
- Parse nooit Markdownbestanden als runtime-invoer.
- Laat lexicale uitzonderingen altijd voorgaan op generieke regels.
- Behandel deze map niet als gedeelde canon, maar als lokale implementatielaag.

## Bestanden
- `irregular-verbs.nl.json`
- `irregular-verbs.schema.json`
- `stem-rules.nl.json`
- `pv-tt-rules.nl.json`
- `pv-vt-rules.nl.json`
- `voltooid-deelwoord-rules.nl.json`
- `prefix-behaviour.nl.json`
- `auxiliary-patterns.nl.json`
- `strong-verb-patterns.nl.json`
