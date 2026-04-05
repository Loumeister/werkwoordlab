# Spellingsalgoritme Werkwoordlab

## Doel
Dit document is de lokale Werkwoordlab-vertaling van het canonieke shared algoritme in:
- shared/grammar-core/docs/werkwoordspellingsalgoritme.md

Als shared/grammar-core lokaal nog niet aanwezig is, blijft dit document inhoudelijk aan dat canonieke model gebonden.

## Hoofdlijn
Werkwoordlab volgt altijd deze volgorde:
1. grammaticale functie bepalen
2. regelpad kiezen
3. override controleren
4. spellingvorm afleiden
5. diagnostische fout koppelen

## Regelpaden
Werkwoordlab gebruikt vijf hoofdregelpaden:
- persoonsvorm tegenwoordige tijd
- persoonsvorm verleden tijd
- infinitief
- voltooid deelwoord
- deelwoordfuncties: bijvoeglijk deelwoord en onvoltooid deelwoord

## Precedentie
Bij conflicterende informatie geldt:
1. expliciete lexicale override
2. prefixgedrag
3. onregelmatig of sterk werkwoordpatroon
4. reguliere spellingregel

## Verplichte stamlogica
Werkwoordlab moet tegelijk kunnen werken met:
- roughStem
- orthographicStem

Zonder dat onderscheid ontstaan fouten bij:
- v/z-werkwoorden
- de/te
- d/t
- lange klinkers

## Hulpwerkwoordlaag
Naast spellingregels moet Werkwoordlab ook deze gedeelde grammaticale principes kunnen modelleren:
- hebben versus zijn
- te-constructies
- kale infinitief
- infinitiefomslag in hulpwerkwoordketens

## Repo-koppeling
Dit document wordt lokaal uitgewerkt in:
- docs/reference-layer-usage.md
- docs/stam-en-stamafleiding.md
- docs/persoonsvorm-tegenwoordige-tijd-regels.md
- docs/persoonsvorm-verleden-tijd-regels.md
- docs/voltooid-deelwoord-regels.md
- docs/scheidbare-en-onscheidbare-werkwoorden.md
- docs/hulpwerkwoorden-en-infinitiefconstructies.md
- docs/onregelmatige-werkwoorden-patronen.md
- docs/hebben-zijn-keuze.md
- content/reference/*.json

## Open implementatievolgorde
1. shared canon vastleggen
2. lokale referentiebestanden gebruiken in evaluator en tests
3. pas daarna nieuwe units en inhoud eromheen structureren
