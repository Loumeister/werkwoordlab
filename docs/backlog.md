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
1. Unit-01 en unit-02 didactisch afronden. ✅ **Afgerond april 2026 (twee passes)** — unit-01: 26 items, unit-02: 25 items (~51 totaal). Tier-1 clusters (beloven, vertrouwen, gebeuren) en Tier-2 clusters (beweren, veranderen) volledig aanwezig in beide units. Cross-unit lexicale paren versterken de contrast-architectuur.
2. Taxonomiecodes volledig koppelen aan items. ✅ Alle items hebben geldige `primaryMisconception`; 11 codes totaal (7 bestaand + 4 nieuw voor VT-domein: `VT_DE_TE_CONFUSION`, `VT_VD_FUNCTION_CONFUSION`, `VT_ENKELVOUD_MEERVOUD`, `VT_RUWE_STAM_OVERRIDE`).
3. Contentkwaliteitsgates automatiseren in tests. ✅ `content-contracts.test.ts` valideert alle invarianten; gerichte evaluatortests in `domain-logic.test.ts` dekken de domeinlogica af.
4. Eerste nieuwe kernunit toevoegen. ✅ **Afgerond april 2026** — `unit-03-pv-vt`: 21 items (7 blokken: -te/-de enkelvoud, -ten/-den meervoud, VT/VD contrast, ruwe stam override, transfer). Totaal 72 oefeningen over 3 units.

**DoD**: drie units schema-geldig en didactisch consistent. ✅

**Volgende stap**: `unit-04-infinitief` ontwerpen (zie `docs/content-expansion-roadmap.md` taakgroep 3).

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
