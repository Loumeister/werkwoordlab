---
name: teacher-insights
description: Wijzig of review Werkwoordlab-docentmetrics, attemptaggregaties, inzichtpagina's en drilldowns. Gebruik voor misconceptionverdeling, accuratesse en deelname; niet voor learner-only interactie of contentwerk zonder effect op docentinzichten.
---

# Teacher Insights

## Leesvolgorde

1. Lees `shared/grammar-core/docs/grammar-platform-principles.md` en `shared/grammar-core/docs/repo-scope-contracts.md`.
2. Lees `docs/product-contract.md`, `docs/product-spec.md`, `docs/architecture.md` en `docs/testing-strategy.md`.
3. Inspecteer daarna de actuele attemptvorm en opslag in `lib/attempt-store.ts` en `lib/use-attempts.ts`, de aggregatielogica en `app/inzichten/`.

## Werkwijze

1. Definieer elke metric vóór implementatie: teller, noemer, filters, tijdvenster, lege toestand en drilldownniveau.
2. Baseer inzichten uitsluitend op actuele attemptdata. Presenteer geplande Prisma-, klas- of cross-productinfrastructuur niet als bestaand runtimegedrag.
3. Beperk het MVP tot bruikbare signalen: misconceptionverdeling, accuratesse en deelname. Voeg een uitsplitsing alleen toe wanneer die een concrete docentactie ondersteunt.
4. Houd output aggregate-first en privacy-safe. Verzamel of toon geen persoonsgegevens die niet noodzakelijk zijn.
5. Behoud de betekenis van misconception-codes door de hele keten van learner attempt tot aggregatie en label. Voeg geen cosmetische code-splitsing toe.
6. Ontwerp nuldata, onvolledige data en corrupte lokale records expliciet; toon geen misleidende percentages.
7. Voeg aggregatie-integratietests en een route- of interactiesmoke voor het docentpad toe.

## Outputcontract

Rapporteer:

- metricdefinities inclusief tellers en noemers;
- gebruikte databron en privacygrens;
- docentactie die elk nieuw inzicht ondersteunt;
- lege/fouttoestanden;
- bijgewerkte tests en resultaat.

## Voltooiingscriteria

- Alle waarden zijn reproduceerbaar uit actuele attempts.
- Geen toekomstig shared teacher platform wordt als operationeel voorgesteld.
- Aggregatietests en relevante docentflowtests slagen.
