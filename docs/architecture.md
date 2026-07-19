# Architectuur

## Startpunt en stack
Vastgestelde stack:
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + SQLite (dev) — *gepland; huidig MVP gebruikt localStorage voor attempt-opslag*
- Vitest
- Playwright

## Kernprincipes
1. Deterministische kern: evaluatorlogica is pure en testbaar.
2. Content-first: oefeninhoud staat in versieerde JSON-bestanden.
3. Functie-voor-spelling: flow dwingt grammaticale functiekeuze vóór spelling.
4. Diagnostiek: feedback levert misconceptiecode + herstelhint.
5. Privacy-first MVP: anonieme sessies, geen verplichte leerlinglogin.

## Systeemdelen
- **Learner UI (Next.js)**: unitselectie, itemflow, scaffold, feedback, transfer.
- **Teacher UI (Next.js)**: geaggregeerde inzichten per klascode/periode.
- **Domain/evaluator (TS)**: functiebepaling, regeltoepassing, misconceptiemapping.
- **Content layer**: JSON loader + schema validatie.
- **Persistence (Prisma/SQLite)**: sessies, attempts, progressie, docentaggregaties — *huidig MVP gebruikt `lib/attempt-store.ts` (localStorage); Prisma-migratie is Fase 3-werk*.

## Shared-core locatie
- De lokale locatie voor gedeelde grammatica-canon is `shared/grammar-core/`.
- `shared/grammar-core/` is een git subtree van `Loumeister/grammar-core` @ `af6aca7` (branch `main`).
- Lokale Werkwoordlab-runtimecontracten blijven leidend voor productspecifiek gedrag; zie `docs/product-contract.md`.
- Synchroniseer met de `grammar-core-sync` skill (of `git subtree pull --prefix=shared/grammar-core https://github.com/Loumeister/grammar-core.git main --squash`); zie `shared/grammar-core/docs/repo-sync-strategy.md`.

## Runtime contract
### Leerlingflow
1. Laad item uit JSON-unit.
2. Toon scaffoldstappen (functie -> regel -> spelling).
3. Evalueer antwoord deterministisch.
4. Sla attempt op met misconceptionCode.
5. Toon feedback en vervolgactie.

### Docentflow
1. Lees attempts op klascode/periode.
2. Aggregeer naar misconceptieverdeling, accuratesse, deelname.
3. Toon dashboard met drilldown per unit/itemtype.

## Data-objecten (MVP)
- `LearnerSession(id, createdAt, locale, classCode?)`
- `Attempt(id, sessionId, unitId, itemId, learnerAnswer, correctness, misconceptionCode, responseMs, createdAt)`
- `UnitProgress(id, sessionId, unitId, startedAt, completedAt, score)`

## Niet in MVP
- Verplichte accounts/auth voor leerlingen.
- LLM-gegenereerde leerlingfeedback.
- Productie-infra uitbreidingen buiten lokale/dev-behoefte.
