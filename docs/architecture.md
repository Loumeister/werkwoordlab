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
- `shared/grammar-core/` is aanwezig als handmatig geboostrappede snapshot van `Loumeister/grammar-core` @ `4a4cfeceac2fe4f37cf81eb395446acd977460a7`.
- Lokale Werkwoordlab-runtimecontracten blijven leidend voor productspecifiek gedrag; zie `docs/product-contract.md`.
- Zie `shared/grammar-core/MIRROR-SOURCE.md` voor sync-instructies en het pad naar een echte git subtree.

## Runtime contract
### Leerlingflow
1. Laad item uit JSON-unit.
2. Bepaal fase (Verkennen / Oefenen / Zelfstandig) via `groupItemsByPhase()`.
3. Kies oefentype adaptief: MasteryExercise, ContrastPairExercise, of RepairExercise.
4. Evalueer antwoord deterministisch.
5. Sla attempt op met misconceptionCode (en optioneel `proofCorrect`).
6. Toon gelaagde feedback en vervolgactie.
7. Na alle fasen: Transfer → Reflectiekaart.

### Docentflow
1. Lees attempts op klascode/periode.
2. Aggregeer naar misconceptieverdeling, accuratesse, deelname.
3. Toon dashboard met drilldown per unit/itemtype.

## Fasemodel (lib/phase-engine.ts)
Items worden ingedeeld in drie actieve fasen, gevolgd door Transfer:

| Fase | Rol | Oefentypen |
|------|-----|------------|
| Verkennen | Scaffolded introductie, functie + spelling expliciet | MasteryExercise (full mode) |
| Oefenen | Herhaling met hulp; repair als remediatie bij fouten | MasteryExercise, ContrastPair, RepairExercise |
| Zelfstandig | Zonder scaffold; repair als robustheidcheck bij bewezen mastery | MasteryExercise (independent mode), RepairExercise |
| Transfer | Schrijftaak / revisieopdracht | TransferTaskPanel |

Fase-indeling: expliciete `phase`-tag in item-JSON of heuristiek (eerste 25% = verkennen, 25–50% = oefenen, rest = zelfstandig).

## Oefentypen
- **MasteryExercise** (`components/learner/mastery-exercise.tsx`): het hoofdtype. Drie ingangsmodi op basis van behaalde mastery:
  - `full`: functie-stap → spelling-stap → [bewijs-chips] → feedback
  - `spell-first`: functie al beheerst, sla functie-stap over
  - `independent`: beide beheerst, directe spelling zonder hints
- **ContrastPairExercise** (`components/learner/contrast-pair-exercise.tsx`): twee vergelijkbare zinnen naast elkaar (Twijfelduel). Toont contrast-inzicht na foute antwoorden.
- **RepairExercise** (`components/learner/repair-exercise.tsx`): zin met foutieve vorm erin. Leerling detecteert de fout en herstelt hem. Adaptief ingepland via `shouldUseRepair()` in `lib/repair-generator.ts`.

## Bewijs-chips (proof chips)
Na de spelling-stap verschijnen soms twee redeneer-chips ("Waarom klopt deze regel hier?"). De leerling kiest de correcte redenering. Chips verschijnen alleen:
- na een fout antwoord, of
- bij de eerste keer dat een misconceptiepatroon in een unit voorkomt.

De keuze wordt opgeslagen als `proofCorrect: boolean` in `AttemptRecord`. De Groei-pagina gebruikt dit om leerlingen te signaleren wanneer spelling goed gaat maar de redenering nog niet stabiel is.

## Data-objecten (MVP)
- `LearnerSession(id, createdAt, locale, classCode?)`
- `Attempt(id, sessionId, unitId, itemId, learnerAnswer, correctness, misconceptionCode, responseMs, createdAt)`
- `UnitProgress(id, sessionId, unitId, startedAt, completedAt, score)`

### AttemptRecord (localStorage MVP — lib/attempt-store.ts)
```
unitId        string   — unit waaruit het item afkomstig is
itemId        string   — item-id, eventueel met suffix:
                          :function   → functie-classificatiestap
                          :repair     → reparateur-oefening
                          (geen suffix = spelling)
correct       boolean
misconception string   — misconceptiecode (of "__function__")
timestamp     string   — ISO 8601
proofCorrect  boolean? — gekozen redeneer-chip correct? Afwezig als chips niet getoond.
```

## Groei-pagina (app/groei/page.tsx)
Toont beheersing per misconceptiecategorie (FEEDBACK_GROUPS) op drie niveaus:
- **Sterk** (≥ 80% correct, ≥ 3 pogingen)
- **Groeiende** (50–79%)
- **Nog lastig** (< 50% of < 3 pogingen)

Toont extra signaal "Je schrijft het goed, maar de redenering is nog niet stabiel" wanneer `proofCorrect`-nauwkeurigheid < 60% terwijl spellingmastery ≥ groeiende is (minimaal 3 chip-pogingen vereist).

## Niet in MVP
- Verplichte accounts/auth voor leerlingen.
- LLM-gegenereerde leerlingfeedback.
- Productie-infra uitbreidingen buiten lokale/dev-behoefte.
