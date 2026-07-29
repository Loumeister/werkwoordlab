---
name: content-seed-generator
description: Maak of wijzig versioned Werkwoordlab-oefenunits, transferopdrachten en lokale taxonomie-implementatie in content/. Gebruik bij nieuwe of uitgebreide contentseeds; niet voor evaluator-only werk of alleen een finale contentreview.
---

# Content Seed Generator

## Leesvolgorde

1. Lees `shared/grammar-core/docs/content-authoring-rules.md`, `shared/grammar-core/docs/werkwoordspellingsdidactiek-kaders.md` en `shared/grammar-core/docs/taxonomy-governance.md`.
2. Lees `docs/product-contract.md`, `docs/content-schema.md`, `docs/didactic-principles.md` en de relevante sectie van `docs/content-expansion-roadmap.md`.
3. Inspecteer daarna de actuele bestanden in `content/`, `lib/content.ts` en de evaluatorondersteuning in `lib/evaluator.ts`.

## Werkwijze

1. Formuleer per toevoeging het leerprobleem, het grammaticale contrast en de beoogde herstelroute.
2. Controleer vóór het schrijven of het bestaande schema, de evaluator en de taxonomie de beoogde itemvorm ondersteunen. Voeg geen content toe die de runtime niet deterministisch kan interpreteren.
3. Hergebruik een bestaande misconception-code wanneer de herstelactie gelijk blijft. Routeer een wijziging aan shared canon eerst naar `grammar-core`; wijzig nooit rechtstreeks `shared/grammar-core/`.
4. Schrijf natuurlijk Nederlands voor onderbouw VO. Laat elk item aantoonbaar nieuwe contrastwaarde, diagnostische waarde, contextwaarde of transferwaarde toevoegen.
5. Vul alle runtime-verplichte velden in. Houd `target` canoniek lowercase, gebruik unieke ids en laat `acceptedVariants` leeg tenzij een werkelijk andere spelling ook correct is.
6. Bouw de zichtbare redenering op als functie bepalen, regelpad kiezen en spelling toepassen. Koppel `primaryMisconception`, hint en feedback aan hetzelfde fouttype.
7. Voeg per unit een voorbereide transferopdracht toe. Registreer een nieuwe unit expliciet in `lib/content.ts`.
8. Voer minimaal `npm test -- tests/unit/content-validation.test.ts tests/unit/content-contracts.test.ts` uit. Voeg evaluator- of domeintests toe wanneer een nieuw domein, itemtype of foutpad wordt geraakt.

## Outputcontract

Rapporteer:

- gewijzigde units en ids;
- het geoefende contrast en de didactische winst;
- toegevoegde of hergebruikte misconception-codes;
- eventuele vereiste evaluator- of schemaverandering;
- uitgevoerde validaties met resultaat.

## Voltooiingscriteria

- Content en taxonomie voldoen aan de actuele runtimecontracten.
- Elk nieuw item heeft één verdedigbaar antwoord- en feedbackpad.
- Geen shared canon is stilzwijgend lokaal herschreven.
- Relevante contenttests slagen, of blokkades zijn met bestand en oorzaak vastgelegd.
