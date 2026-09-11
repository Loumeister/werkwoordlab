---
name: didactic-workwoordspelling
description: Wijzig of review de deterministische Werkwoordlab-evaluator, diagnostische feedbackmapping, scaffold-afbouw en unitprogressie. Gebruik voor functie-, regel- en spellingbeslissingen; niet voor content-only, visueel-only of docentrapportage-only werk.
---

# Didactische Werkwoordspelling

## Leesvolgorde

1. Lees `shared/grammar-core/docs/werkwoordspellingsdidactiek-kaders.md`, `shared/grammar-core/docs/werkwoordspellingsalgoritme.md` en `shared/grammar-core/docs/taxonomy-governance.md`.
2. Lees `docs/product-contract.md`, `docs/didactic-principles.md`, `docs/content-schema.md` en `docs/testing-strategy.md`.
3. Inspecteer daarna de actuele contracten in `lib/evaluator.ts`, `lib/content.ts`, `lib/phase-engine.ts`, `lib/feedback/`, `content/` en de bijbehorende tests.

## Werkwijze

1. Reproduceer of beschrijf eerst het huidige runtimegedrag. Documentatie is geen bewijs dat de evaluator iets al ondersteunt.
2. Maak het beslispad expliciet: grammaticale functie, regelpad, lexicale of morfologische override, spellingvorm en zichtbare verantwoording.
3. Houd de leerlingloop volledig deterministisch. Voeg geen LLM, probabilistische classificatie of verborgen heuristiek toe.
4. Behandel homofonen via grammaticale functie. Laat klank of de meest vertrouwde vorm nooit de beslissing vervangen.
5. Koppel elk afgehandeld foutpad aan een specifieke misconception-code en een uitvoerbare herstelhint. Splits codes alleen bij een andere herstelroute én een nuttiger docentsignaal.
6. Bewaar invoernormalisatie: trim en vergelijk case-insensitief; houd contenttargets lowercase en laat `acceptedVariants` het target niet dupliceren.
7. Pas scaffold en fading alleen aan op aantoonbare beheersing. Houd functiebeheersing en patroonbeheersing afzonderlijk waar de runtime dat onderscheid maakt.
8. Voeg unit tests en minimaal één integratietest toe voor gewijzigd evaluator- of feedbackgedrag. Werk lokale contractdocumentatie in dezelfde wijziging bij wanneer een publiek content- of architectuurcontract verandert.

## Outputcontract

Rapporteer:

- oud en nieuw beslispad;
- geraakt fouttype en misconception-code;
- effect op content, feedback, progressie en docentaggregatie;
- bijgewerkte tests en hun resultaat;
- eventuele afwijking tussen runtime en documentatie.

## Voltooiingscriteria

- De canonieke functie-eerst-volgorde blijft intact.
- Dezelfde invoer levert steeds hetzelfde resultaat.
- Elk nieuw foutpad heeft diagnostische feedback.
- Relevante unit- en integratietests slagen.
