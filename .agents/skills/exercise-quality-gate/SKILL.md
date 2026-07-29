---
name: exercise-quality-gate
description: Review en valideer Werkwoordlab-unit- en taxonomie-JSON op schema-invarianten, antwoordambiguïteit, didactische waarde en misconception-dekking. Gebruik vóór merge of bij wijziging van contentvalidatie; niet voor UI- of dashboardwerk zonder contentcontract.
---

# Exercise Quality Gate

## Leesvolgorde

1. Lees `shared/grammar-core/docs/content-authoring-rules.md`, `shared/grammar-core/docs/werkwoordspellingsdidactiek-kaders.md` en `shared/grammar-core/docs/taxonomy-governance.md`.
2. Lees `docs/product-contract.md`, `docs/content-schema.md` en `docs/didactic-principles.md`.
3. Inspecteer de actuele JSON, `lib/content.ts`, `lib/evaluator.ts` en de contentvalidatietests.

## Werkwijze

1. Valideer JSON-syntax, verplichte velden en alle runtime-enums.
2. Controleer unieke unit-ids en item-ids, Nederlandse taal, volledige scaffold/diagnostic/feedback, geldige taxonomyreferenties, bewuste `acceptedVariants`, minimale unitomvang en een transferopdracht.
3. Controleer dat nieuwe units in de actuele contentregistry staan en dat elk itemtype door de evaluator en learner UI wordt ondersteund.
4. Test ieder prompt-targetpaar op één duidelijk antwoordpad. Markeer alternatieve plausibele antwoorden, grammaticale dubbelzinnigheid en context die de beoogde functie niet afdwingt.
5. Beoordeel didactische waarde: functie-eerst, betekenisvol contrast, gerichte foutdiagnose, passende afbouw en voorbereide transfer. Wijs oppervlakkige duplicaten af.
6. Controleer dat een nieuwe misconception-code een eigen herstelroute en docentsignaal heeft en correct als shared of productlokaal is geclassificeerd.
7. Voer minimaal `npm test -- tests/unit/content-validation.test.ts tests/unit/content-contracts.test.ts` uit en voeg gerichte domeintests toe voor nieuwe itemtypen of functies.

## Outputcontract

Rapporteer per bevinding:

- bestand en item-id;
- geschonden invariant of didactisch principe;
- ernst `blocker` of `advies`;
- concreet herstel.

Sluit af met de uitgevoerde commando's en een oordeel `pass` of `block`.

## Voltooiingscriteria

- Alle machinecontroleerbare contentinvarianten slagen.
- Er zijn geen onverklaarde alternatieve antwoordpaden.
- Elke misconceptionreferentie en elk itemtype werkt door tot evaluator en feedback.
