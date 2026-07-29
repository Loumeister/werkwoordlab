---
name: shared-content-integration
description: Integreer of review canonieke grammar-core-zinnen en metadata in Werkwoordlab via kleine expliciete adapters. Gebruik bij shared-content-consumptie of adaptermapping; niet voor lokale contentauthoring zonder shared bron of een brede runtime-migratie.
---

# Shared Content Integration

## Leesvolgorde

1. Lees `shared/grammar-core/.codex/skills/shared-content-integration/SKILL.md`.
2. Lees `shared/grammar-core/docs/content-authoring-rules.md`, `shared/grammar-core/docs/repo-sync-strategy.md`, `shared/grammar-core/docs/taxonomy-governance.md` en `shared/grammar-core/docs/grammar-platform-principles.md`.
3. Lees `shared/grammar-core/adapters/werkwoordlab.md` en `docs/product-contract.md`.
4. Inspecteer daarna de gedeelde bronobjecten en de actuele lokale contracten in `content/`, `lib/content.ts`, `lib/evaluator.ts` en de contenttests.

## Werkwijze

1. Verifieer eerst of de gevraagde shared bron werkelijk bestaat en operationeel consumeerbaar is. Behandel toekomstige platformrichting niet als huidige runtime.
2. Houd de eerste integratie klein, expliciet en omkeerbaar. Vermijd verborgen fallbacks en een brede vervanging van de lokale contentpipeline.
3. Bewaar gedeelde ids, zintekst en canonieke metadata waar mogelijk. Voeg unit-scaffold, interactiemodus, feedbackkopij, routes en persistence uitsluitend lokaal toe.
4. Map shared labels en misconceptionreferenties expliciet naar lokale velden. Verander geen betekenis om een schema passend te maken.
5. Wijzig nooit rechtstreeks bestanden onder `shared/grammar-core/`. Routeer ontbrekende canonieke metadata of schemas eerst upstream en synchroniseer ze daarna terug.
6. Voeg adaptertests toe voor mapping, onbekende of onvolledige bronobjecten en regressie van onaangeraakte lokale content.

## Outputcontract

Rapporteer:

- gebruikte shared bronbestanden en ids;
- expliciete veldmapping van shared naar lokaal;
- lokale verrijkingen;
- niet-gemigreerde content en rollbackgrens;
- tests en resterende upstreambehoeften.

## Voltooiingscriteria

- Canonieke shared inhoud blijft ongewijzigd.
- De mapping is zichtbaar, getest en zonder schema- of taxonomiedrift.
- Onaangeraakte lokale units blijven werken.
