---
name: learner-flow-ui
description: Bouw of review leerlinggerichte Werkwoordlab-routes, componenten en interactiestaten met didactische scaffolding, toegankelijkheid en lage cognitieve belasting. Gebruik voor learner UI en flow; niet voor evaluator-only, content-only of docentdashboard-only werk.
---

# Learner Flow UI

## Combinatie met algemene designskills

- Gebruik `frontend-design` voor visuele richting en frontenduitwerking wanneer die skill beschikbaar is.
- Gebruik deze skill daarnaast voor de productspecifieke didactische interactieregels.
- Gebruik `web-design-guidelines` als afsluitende UI- en toegankelijkheidsaudit wanneer die skill beschikbaar is.

## Leesvolgorde

1. Lees `shared/grammar-core/docs/werkwoordspellingsdidactiek-kaders.md` en `shared/grammar-core/docs/grammar-platform-principles.md`.
2. Lees `docs/product-contract.md`, `docs/product-spec.md`, `docs/didactic-principles.md` en `docs/testing-strategy.md`.
3. Inspecteer daarna de actuele routes onder `app/`, componenten onder `components/learner/`, `lib/phase-engine.ts`, `lib/evaluator.ts` en `lib/attempt-store.ts`.

## Werkwijze

1. Teken de geraakte toestanden en overgangen uit voordat je componenten wijzigt.
2. Behoud de leerketen: functie herkennen, redeneerstappen zichtbaar maken, spelling kiezen, diagnostische feedback tonen, herstellen of doorgaan en transfer uitvoeren.
3. Laat scaffolding afnemen op basis van het bestaande deterministische beheersingscontract. Verberg nooit essentiële feedback of de reden waarom een antwoord fout is.
4. Gebruik uitsluitend Nederlandstalige leerlingkopij. Houd instructies kort, concreet en bruikbaar op gangbare schoolapparaten.
5. Gebruik echte content uit de versioned JSON-laag; hardcode geen oefenitems of correcte antwoorden in UI-code.
6. Houd de flow anoniem en zonder verplichte login. Voeg geen LLM-gedrag toe aan de learner loop.
7. Borg toetsenbordbediening, zichtbare focus, semantische labels, foutmeldingen, voldoende contrast en voorspelbare statusovergangen.
8. Voeg of wijzig Playwright-dekking voor het aangepaste pad. Voeg unit tests toe wanneer toestands- of progressielogica buiten de component verandert.

## Outputcontract

Rapporteer:

- gewijzigde learnerstaten en overgangen;
- hoe functie-eerst, scaffold, feedback en transfer geborgd blijven;
- toegankelijkheidskeuzes;
- gewijzigde tests en resultaat;
- eventueel gebruikte algemene design- en auditskills.

## Voltooiingscriteria

- De flow blijft deterministisch, data-driven en anoniem toegankelijk.
- Geen didactische stap is door visuele vereenvoudiging verloren gegaan.
- Het gewijzigde Playwright-pad slaagt en relevante auditbevindingen zijn opgelost of vastgelegd.
