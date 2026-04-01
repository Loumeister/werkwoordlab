# Implementatiebacklog (gefaseerd)

## Fase 0 — Bootstrap
1. Next.js + TypeScript + Tailwind initialiseren.
2. Prisma + SQLite schema/migratie opzetten.
3. Vitest + Playwright configureren.
4. Content loader + schema-validatiepad toevoegen.

**DoD**: app start lokaal; basis testcommando's werken; content wordt ingelezen en gevalideerd.

## Fase 1 — Learner core loop
1. Unitselectie en itemrunner.
2. Scaffold UI (functie -> regel -> spelling).
3. Deterministische evaluator + misconception feedback.
4. Unitafronding met transferopdracht.

**DoD**: volledige learnerflow voor unit-01 werkt met correcte feedback.

## Fase 2 — Content opschalen
1. Unit-01 en unit-02 didactisch afronden (10-15 items elk).
2. Taxonomiecodes volledig koppelen aan items.
3. Contentkwaliteitsgates automatiseren in tests.

**DoD**: beide units schema-geldig en didactisch consistent.

## Fase 3 — Teacher insights MVP
1. Attempts/progress opslaan.
2. Aggregatieservice (misconcepties, accuratesse, deelname).
3. Dashboard met bruikbare drilldowns per unit/itemtype.

**DoD**: docentzicht draait op echte attemptdata.

## Fase 4 — Release hardening
1. Toegankelijkheid en NL-copy polish.
2. Performance en privacycontrole.
3. Volledige release-checklist dry run.

**DoD**: release-klaar volgens `docs/release-checklist.md`.
